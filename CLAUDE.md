# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**WebInsight Analyzer** is a comprehensive website analysis tool that provides marketers and business owners with instant, actionable insights about any website's business potential. It consolidates SEO metrics, technical analysis, traffic estimates, and AI-powered business model assessment into a single PDF report.

### Tech Stack
- **Frontend/Backend:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS with SmartCamp.AI branding (Jungle Tech aesthetic)
- **UI Components:** shadcn/ui
- **Database & Auth:** Supabase (self-hosted on SmartCamp.AI VPS)
- **File Storage:** Supabase Storage
- **Rate Limiting:** Redis (SmartCamp.AI VPS)
- **PDF Generation:** Gotenberg service (SmartCamp.AI VPS)
- **AI Analysis:** Claude API (Anthropic) primary, OpenAI GPT-4 fallback
- **Deployment:** Vercel (frontend), SmartCamp.AI VPS (backend services)

---

## Project Structure

### Root Documentation
- **`Web Insight AnalyzerPRD.md`** - Complete Product Requirements Document (MUST READ before coding)
- **`VPS_CONFIGURATION_GUIDE.md`** - VPS infrastructure and service configurations
- **`branding/`** - SmartCamp.AI brand assets and design guidelines

### Key Directories (To Be Created)
```
/app                    # Next.js App Router pages and layouts
/components             # React components
  /ui                   # shadcn/ui components
/lib                    # Utility functions and API clients
  /supabase             # Supabase client configuration
  /redis                # Redis client for rate limiting
  /ai                   # Claude/OpenAI API clients
/public                 # Static assets (SmartCamp branding)
/types                  # TypeScript type definitions
```

---

## Architecture & Key Concepts

### Data Flow
1. User enters URL → Frontend validates and normalizes
2. API route `/api/analyze` triggered → Checks rate limits (Redis)
3. Parallel data gathering:
   - Google PageSpeed Insights API (SEO + technical)
   - Custom Node.js checks (HTTPS, headers, meta tags)
   - Claude API analyzes content for business model
4. Store results in Supabase → Generate PDF via Gotenberg
5. Upload PDF to Supabase Storage → Return download link

### Rate Limiting Strategy
- **Anonymous users:** IP-based limits (3/hour, 10/day) via Redis
- **Authenticated users:** Bypass IP limits (unlimited for MVP)
- Redis keys: `rate_limit:{ip}:hour` and `rate_limit:{ip}:day` with TTL

### Authentication Flow
- Supabase Auth (email/password, email verification required)
- Protected routes use middleware to check session
- RLS policies ensure users only access their own data

### PDF Generation
- HTML template → Gotenberg service → PDF blob
- Gotenberg endpoint: `https://gotenberg.smartcamp.ai`
- Basic Auth credentials: Username `Bangla84PL`, Password `SmartCamp2025!`
- Upload to Supabase Storage bucket: `website-analysis-reports`

---

## Development Commands

### Initial Setup
```bash
# Initialize Next.js project (if not done)
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install ioredis @upstash/ratelimit
npm install zod react-hook-form @hookform/resolvers
npm install @anthropic-ai/sdk openai
npm install lucide-react class-variance-authority clsx tailwind-merge

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input form table toast

# Install Jost font (SmartCamp branding)
# Add to app/layout.tsx:
# import { Jost } from "next/font/google"
```

### Development Server
```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management
```bash
# Access Supabase Studio
# URL: https://supabase.smartcamp.ai
# Auth: Basic Auth via Traefik (see VPS_CONFIGURATION_GUIDE.md)

# Run migrations (create in Supabase Studio SQL Editor)
# See PRD Section 8 for schema
```

### Testing
```bash
# Test rate limiting locally
# Use different IP addresses or VPN to simulate multiple users

# Test PDF generation
curl -X POST https://gotenberg.smartcamp.ai/forms/chromium/convert/html \
  -u "Bangla84PL:SmartCamp2025!" \
  -F "files=@test.html" \
  --output test.pdf
```

---

## Environment Variables

Create `.env.local` with:

```bash
# Supabase (SmartCamp.AI VPS)
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUxNzk0MzAwLCJleHAiOjIwNjcxNTQzMDB9.OuEL1wHusMc323PhIe_pjbme3DSstlWn5DB0m9uorTc
SUPABASE_SERVICE_ROLE_KEY=[Get from VPS_CONFIGURATION_GUIDE.md]

# Redis (SmartCamp.AI VPS) - Get connection details from VPS
REDIS_URL=redis://[VPS_REDIS_HOST]:[PORT]
# OR if using Upstash Redis:
# UPSTASH_REDIS_REST_URL=https://...
# UPSTASH_REDIS_REST_TOKEN=...

# Gotenberg (SmartCamp.AI VPS)
GOTENBERG_URL=https://gotenberg.smartcamp.ai
GOTENBERG_USERNAME=Bangla84PL
GOTENBERG_PASSWORD=SmartCamp2025!

# AI APIs
ANTHROPIC_API_KEY=sk-ant-... # Your Claude API key
OPENAI_API_KEY=sk-...        # Fallback (optional)

# Optional
GOOGLE_PAGESPEED_API_KEY=... # Optional, free tier works without key

# Application
NEXT_PUBLIC_APP_URL=https://webinsight.smartcamp.ai
```

---

## Database Schema

### Supabase Tables

#### `analyses` table
```sql
CREATE TABLE analyses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  normalized_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'completed',
  error_message text,

  -- Analysis Results (JSON)
  seo_data jsonb,
  technical_data jsonb,
  traffic_data jsonb,
  business_analysis jsonb,

  -- PDF Storage
  pdf_url text,
  pdf_size integer,

  -- Metadata
  processing_time integer,
  api_calls_made jsonb
);

-- Indexes
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_normalized_url ON analyses(normalized_url);
```

#### Row Level Security (RLS)
```sql
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);
```

### Storage Buckets

#### `website-analysis-reports` bucket
- Path structure: `{user_id}/{analysis_id}.pdf`
- Public read via signed URLs (1 hour expiry)
- Write access via service role key only

---

## SmartCamp.AI Branding Implementation

### Required Files (Copy from `branding/assets/`)
```
/public/
├── jungle background.png       # Main background
├── SmartCampAIpng.png         # Logo
├── Monkey_SmartCampAI-no-background.png
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
└── og-image.png
```

### Font Setup (app/layout.tsx)
```typescript
import { Jost } from "next/font/google";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
```

### CSS Variables (app/globals.css)
```css
:root {
  --background: transparent;
  --foreground: #ffffff;
  --card: rgba(255, 255, 255, 0.15);
  --border: rgba(255, 255, 255, 0.2);
  --primary: #ffffff;
  --accent: #10b981; /* Emerald green */
}

body {
  background-image: url('/jungle background.png');
  background-size: cover;
  background-attachment: fixed;
  font-family: var(--font-jost), sans-serif;
  color: var(--foreground);
}
```

### Glass Morphism Pattern
All cards/containers should use:
```tsx
<Card className="bg-white/15 backdrop-blur border-white/20">
```

**Important:** Read `branding/SmartCampAI_branding.md` for complete design specifications.

---

## Critical Implementation Guidelines

### Before Writing Code
1. **READ THE PRD** - `Web Insight AnalyzerPRD.md` contains all requirements and specifications
2. **Review VPS Guide** - Understand Supabase, Redis, and Gotenberg configurations
3. **Check Branding** - Follow SmartCamp design system exactly

### Security Considerations
- Never commit `.env.local` - already in `.gitignore`
- Use Supabase RLS for all database access
- Validate and sanitize all URL inputs (prevent SSRF attacks)
- Rate limit aggressively (prevent abuse)
- Use service role key only in API routes (never expose to client)

### PDF Report Requirements
- Must include footer on every page: `"© Created with ❤️ by SmartCamp.AI"` linking to `https://smartcamp.ai`
- Professional layout with clear sections (see PRD Section 6.3)
- Optimize for <2MB file size
- Watermark for anonymous users: `"Generated by WebInsight Analyzer - Sign up for full features"`

### Performance Targets
- Analysis completion: <45 seconds (target: 30s)
- PDF generation: <10 seconds
- First Contentful Paint: <1.5s
- API route response: <500ms (excluding external API calls)

### Error Handling
- All external API calls must have retry logic (1 retry)
- If Claude API fails, fall back to OpenAI
- Return partial reports if some data sources fail (don't fail completely)
- Display clear, user-friendly error messages

### Testing Strategy
1. Test with various website types (SaaS, e-commerce, blogs)
2. Test rate limiting with multiple IPs
3. Test authentication flow completely
4. Test PDF generation with long/short content
5. Test mobile responsiveness thoroughly

---

## Development Workflow (From PRD Section 13)

### Phase 1: Foundation (Days 1-3)
- Initialize Next.js with TypeScript + Tailwind
- Set up Supabase integration (auth + database)
- Create database schema and RLS policies
- Configure Redis connection
- Implement global footer component
- Copy SmartCamp branding assets

### Phase 2: Core Analysis Engine (Days 4-7)
- Implement URL normalization and validation
- Create `/api/analyze` route
- Integrate Google PageSpeed Insights
- Integrate Claude API for business analysis
- Store results in Supabase

### Phase 3: Rate Limiting (Days 7-8)
- Implement Redis-based rate limiting middleware
- Display remaining analyses in UI
- Test with multiple IPs

### Phase 4: PDF Generation (Days 8-10)
- Design HTML template
- Integrate Gotenberg API
- Upload PDFs to Supabase Storage
- Return signed URLs

### Phase 5: User Dashboard (Days 10-12)
- Create `/dashboard` page
- Fetch and display user analyses
- Implement delete functionality
- Add search and pagination

### Phase 6: UI Polish & Testing (Days 12-14)
- Loading states and error handling
- Responsive design refinement
- Accessibility improvements
- Cross-browser testing

---

## API Routes Structure

```
/app/api/
├── analyze/
│   └── route.ts              # POST - Main analysis endpoint
├── auth/
│   ├── signup/route.ts       # POST - User registration
│   └── callback/route.ts     # GET - Supabase auth callback
└── dashboard/
    ├── analyses/route.ts     # GET - Fetch user analyses
    └── [id]/
        ├── route.ts          # DELETE - Delete analysis
        └── download/route.ts # GET - Re-download PDF
```

---

## Common Tasks

### Add a new analysis data source
1. Create utility function in `/lib/analyzers/`
2. Update analysis data structure in `/types/`
3. Integrate into `/app/api/analyze/route.ts`
4. Update PDF template to include new data
5. Update database schema if needed

### Modify PDF template
1. Edit HTML template in `/lib/pdf/template.ts`
2. Test with Gotenberg locally
3. Ensure footer is on every page
4. Verify file size remains <2MB

### Update rate limits
1. Modify Redis TTL values in `/lib/redis/rateLimit.ts`
2. Update UI text to match new limits
3. Update PRD documentation

### Add new authentication method
1. Configure provider in Supabase dashboard
2. Update `/lib/supabase/auth.ts`
3. Add UI buttons in auth pages
4. Test complete flow

---

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set in Vercel
- [ ] Database migrations applied in Supabase
- [ ] Storage bucket created with correct policies
- [ ] RLS policies tested and verified
- [ ] Rate limiting tested with production Redis
- [ ] PDF generation tested with production Gotenberg
- [ ] SmartCamp branding fully implemented
- [ ] All images optimized
- [ ] Accessibility tested (WCAG AA)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete

### Post-Deployment
- [ ] Test complete user flow on production
- [ ] Monitor error logs in Vercel
- [ ] Verify SSL certificates active
- [ ] Test rate limiting on production
- [ ] Check database performance
- [ ] Verify storage bucket access
- [ ] Test PDF downloads

---

## Troubleshooting

### "Cannot connect to Supabase"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check VPS Supabase service is running: `docker ps | grep supabase`
- Test connection: `curl https://api.supabase.smartcamp.ai`

### "Redis connection failed"
- Check Redis URL in environment variables
- Verify VPS Redis service: `docker exec supabase-db redis-cli ping`
- Test rate limiting logic independently

### "PDF generation timeout"
- Ensure Gotenberg service is running on VPS
- Check Basic Auth credentials are correct
- Verify HTML template is valid (no JS errors)
- Reduce HTML complexity if needed

### "Rate limit not working"
- Check Redis keys exist: `redis-cli KEYS rate_limit:*`
- Verify IP address extraction logic
- Test with curl using different X-Forwarded-For headers

### "Analysis takes too long"
- Profile external API calls (which is slowest?)
- Implement better parallelization with `Promise.all()`
- Consider caching common analysis results
- Optimize Claude API prompt (fewer tokens)

---

## Important Notes

### URL Normalization
Always normalize URLs before processing:
```typescript
// Remove protocol, www, trailing slash
const normalized = url
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/\/$/, '');
```

### Claude API Usage
Use structured prompts with JSON output:
```typescript
const prompt = `Analyze this website and return JSON:
{
  "business_model": "SaaS|ecommerce|content|lead-gen",
  "target_audience": "string",
  "recommendations": ["string", "string", "string"]
}`;
```

### Supabase Storage URLs
Generate signed URLs for PDF downloads (1 hour expiry):
```typescript
const { data } = await supabase.storage
  .from('website-analysis-reports')
  .createSignedUrl(`${userId}/${analysisId}.pdf`, 3600);
```

### Footer Requirement
Every view MUST include SmartCamp footer:
```tsx
<footer className="text-center py-4 text-white/70">
  © Created with ❤️ by{' '}
  <a href="https://smartcamp.ai" className="text-emerald-400 hover:underline">
    SmartCamp.AI
  </a>
</footer>
```

---

## Success Metrics (From PRD)

### Technical Success
- Analysis completes in <60 seconds
- Rate limiting works (3/hour, 10/day for anonymous)
- Auth flow functional (signup, login, logout, reset)
- Dashboard displays analyses correctly
- PDFs generated and stored successfully
- Responsive on all devices

### User Experience Success
- Value proposition clear on landing page
- Analysis feels fast and professional
- PDFs comprehensive and actionable
- Error messages clear and helpful

### Business Success
- 100+ analyses in first 30 days
- 10%+ conversion to registered users
- Positive user feedback
- No infrastructure issues

---

## Contact & Resources

- **VPS Infrastructure:** See `VPS_CONFIGURATION_GUIDE.md`
- **Product Requirements:** See `Web Insight AnalyzerPRD.md`
- **Branding Guide:** See `branding/SmartCampAI_branding.md`
- **SmartCamp Website:** https://smartcamp.ai
- **Email:** hello@smartcamp.ai

---

**Last Updated:** November 17, 2025
**Status:** Pre-Development (No code written yet)
**Target Launch:** December 1, 2025
