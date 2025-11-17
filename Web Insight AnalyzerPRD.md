# Product Requirements Document: WebInsight Analyzer

## 1. Executive Summary

WebInsight Analyzer is a comprehensive website analysis tool that provides marketers and business owners with instant, actionable insights about any website's business potential. By consolidating SEO metrics, technical analysis, traffic estimates, and AI-powered business model assessment into a single PDF report, it eliminates the need to use multiple scattered tools.

The MVP allows anonymous users to analyze up to 3 websites per hour (10 per day) without registration, while authenticated users can save their analysis history and access past reports through a personal dashboard.

## 2. Problem Statement

Digital marketing agencies and business owners currently face significant friction when evaluating websites:
- **Scattered tools**: SEO analysis in one tool, traffic data in another, technical audits in a third
- **Time waste**: Manually gathering data from multiple sources and compiling reports
- **Inconsistent data**: Different tools provide conflicting metrics
- **Cost barrier**: Premium tools are expensive for occasional use

WebInsight Analyzer solves this by providing a unified, AI-enhanced analysis in seconds, accessible to everyone through a freemium model.

## 3. Target Users

### Primary Persona 1: Marketing Agency Analyst
- **Profile**: 25-40 years old, works at digital marketing agency
- **Goal**: Quickly assess client/competitor websites for campaigns
- **Pain Point**: Wastes 30+ minutes gathering data from multiple tools
- **Success Metric**: Reduces analysis time from 30 minutes to 2 minutes

### Primary Persona 2: Small Business Owner
- **Profile**: 30-55 years old, runs online or local business
- **Goal**: Understand their website's performance and improvement opportunities
- **Pain Point**: Can't afford expensive SEO/analytics tools
- **Success Metric**: Gets professional-grade insights for free

## 4. Goals & Success Metrics

### Business Objectives
- Launch MVP within 2 weeks
- Achieve 100 analyses in first month
- Convert 10% of users to registered accounts
- Validate product-market fit for future premium features

### Key Performance Indicators
- **Usage**: Number of analyses performed (target: 500/month by Month 3)
- **Engagement**: Registered user percentage (target: 15% conversion)
- **Retention**: Users returning for 2nd analysis (target: 30%)
- **Technical**: Average report generation time (target: <45 seconds)
- **Quality**: Report completion rate without errors (target: 95%+)

### Definition of Success
- Users can analyze any valid website URL and receive actionable insights
- Anonymous users experience seamless rate limiting without frustration
- Authenticated users find value in saving and accessing report history
- PDF reports are comprehensive, professional, and shareable

## 5. User Stories

### Anonymous User Stories
- As a **visitor**, I want to enter a website URL and click "Analyze" so that I can quickly evaluate a website
- As a **visitor**, I want to see my analysis results immediately on screen so that I can decide if I want the PDF
- As a **visitor**, I want to download a professional PDF report so that I can share it with my team
- As a **visitor**, I want to know my remaining analyses (3/hour, 10/day) so that I can plan my usage
- As a **visitor**, I want the option to sign up so that I can save my analysis history

### Authenticated User Stories
- As a **registered user**, I want to sign up with email/password so that I can access premium features
- As a **registered user**, I want to log in easily so that I can access my saved reports
- As a **registered user**, I want all my analyses automatically saved so that I don't lose valuable research
- As a **registered user**, I want to view a dashboard of past analyses so that I can revisit previous insights
- As a **registered user**, I want to re-download PDFs from past analyses so that I don't need to re-run them
- As a **registered user**, I want to see when each analysis was performed so that I can track changes over time
- As a **registered user**, I want to delete old analyses so that I can keep my dashboard organized

## 6. Functional Requirements

### 6.1 Core Features (MVP)

#### Feature 1: Website Analysis Engine
**Description**: Core analysis system that gathers and processes website data

**Requirements**:
- Accept any valid URL (with or without http/https, with or without www)
- Normalize URLs to canonical form before processing
- Perform parallel data gathering from multiple sources:
  - **SEO Analysis**: Meta tags, titles, descriptions, headings structure, robots.txt, sitemap.xml
  - **Technical Analysis**: Page speed, mobile-friendliness, HTTPS status, security headers
  - **Traffic Estimation**: Using free APIs or web scraping techniques
  - **Business Model Assessment**: AI-powered analysis of content, monetization signals, competitive positioning
- Validate that URL is accessible (return clear error if site is down or blocks bots)
- Complete analysis within 45 seconds (target: 30 seconds)

#### Feature 2: AI-Powered Insights
**Description**: Claude/OpenAI integration for intelligent business analysis

**Requirements**:
- Analyze scraped website content to determine:
  - Primary business model (SaaS, e-commerce, content/ads, lead generation, etc.)
  - Target audience and market positioning
  - Key value propositions
  - Competitive advantages or weaknesses
  - Improvement recommendations (top 3-5 actionable items)
- Use structured prompts to ensure consistent, actionable output
- Handle API failures gracefully (retry once, then return partial report)

#### Feature 3: PDF Report Generation
**Description**: Professional PDF report generated via Gotenberg on VPS

**Requirements**:
- Generate comprehensive PDF including:
  - Cover page with website URL, analysis date, and branding
  - Executive Summary (AI-generated overview)
  - SEO Section (meta analysis, keyword opportunities, technical SEO score)
  - Technical Section (performance metrics, security, mobile-friendliness)
  - Traffic & Audience Section (estimated traffic, geographic distribution if available)
  - Business Model Section (AI assessment and recommendations)
  - Footer on every page: "© Created with ❤️ by SmartCamp.AI" linking to https://smartcamp.ai
- Use clean, professional HTML template for Gotenberg conversion
- Include charts/visualizations where applicable (simple HTML/CSS based)
- File size optimization (target: <2MB per report)
- Watermark for anonymous users: "Generated by WebInsight Analyzer - Sign up for full features"

#### Feature 4: Rate Limiting System
**Description**: Redis-based rate limiting for anonymous users

**Requirements**:
- Track requests by IP address
- Limits for anonymous users:
  - 3 analyses per hour (rolling window)
  - 10 analyses per day (rolling window)
- Clear error messages when limits exceeded:
  - "You've reached your hourly limit (3 analyses). Please try again in X minutes."
  - "You've reached your daily limit (10 analyses). Sign up for unlimited analysis or try again tomorrow."
- Display remaining analyses count in UI
- Authenticated users bypass IP-based limits (no limits for MVP)

#### Feature 5: User Authentication
**Description**: Supabase Auth for user registration and login

**Requirements**:
- Email/password authentication via Supabase Auth
- Email verification required for new signups
- Password reset functionality
- Session management with secure cookies
- Protected routes for dashboard
- Social auth (Google OAuth) - optional for MVP, nice-to-have

#### Feature 6: Analysis History Dashboard
**Description**: Personal dashboard for authenticated users to view past analyses

**Requirements**:
- Display table/list of all user's analyses showing:
  - Website URL (clickable link)
  - Analysis date/time
  - Quick status (e.g., "Completed", "Error")
  - Action buttons: "View Report" (re-download PDF), "Delete"
- Sort by date (newest first by default)
- Search/filter by URL
- Pagination (20 per page)
- Store in Supabase:
  - `analyses` table: `id`, `user_id`, `url`, `created_at`, `pdf_url`, `analysis_data` (JSON with all metrics)
- PDF storage in Supabase Storage bucket
- Delete functionality (soft delete or hard delete - hard delete for MVP)

### 6.2 Future Features (Post-MVP)

- **Competitor Comparison**: Analyze multiple websites side-by-side
- **Monitoring & Alerts**: Track website changes over time, email alerts for significant changes
- **API Access**: Allow developers to integrate analysis into their own tools
- **Team Collaboration**: Share reports within team workspaces
- **Premium Data Sources**: Integrate paid APIs (Ahrefs, SEMrush) for deeper insights
- **Custom Branding**: White-label reports for agencies
- **Scheduled Reports**: Automated weekly/monthly analysis emails
- **Export Formats**: Excel, JSON, in addition to PDF

### 6.3 User Flows

#### Flow 1: Anonymous User - Quick Analysis
1. User lands on homepage
2. User sees hero section with URL input field and "Analyze" button
3. User enters website URL (e.g., "example.com")
4. User clicks "Analyze"
5. System shows loading screen (progress indicator)
6. System displays results page with:
   - Key metrics summary
   - "Download PDF Report" button
   - "Sign up to save this analysis" CTA
7. User downloads PDF
8. User sees remaining analyses count (e.g., "2 analyses remaining today")

#### Flow 2: Anonymous User - Rate Limit Exceeded
1. User enters 4th URL in same hour
2. System shows error modal:
   - "You've reached your hourly limit (3 analyses)"
   - "Try again in 42 minutes, or sign up for unlimited access"
   - CTA button: "Sign Up Free"
3. User can either wait or sign up

#### Flow 3: Authenticated User - First Analysis
1. User signs up / logs in
2. User is redirected to homepage (or dashboard if returning)
3. User enters URL and clicks "Analyze"
4. System performs analysis (no rate limit check for authenticated users)
5. Results page shows:
   - Key metrics summary
   - "Download PDF Report" button
   - "Analysis saved to your dashboard" notification
6. User can click "View Dashboard" to see history

#### Flow 4: Authenticated User - Access Past Report
1. User navigates to Dashboard
2. User sees list of all past analyses
3. User clicks "View Report" on any past analysis
4. PDF downloads immediately (retrieved from Supabase Storage)

## 7. Technical Requirements

### 7.1 Platform
- **Primary Platform**: Web application (desktop + mobile responsive)
- **Browser Support**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile**: Fully responsive design, touch-optimized

### 7.2 Architecture

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (for forms, modals, tables)
- **State Management**: React Context + React Query for server state
- **Form Handling**: React Hook Form + Zod validation

#### Backend
- **API Routes**: Next.js API routes for backend logic
- **Runtime**: Node.js 18+
- **Rate Limiting**: Redis (hosted on SmartCamp.AI VPS)
  - Library: `upstash/ratelimit` or `express-rate-limit` with Redis adapter
- **PDF Generation**: Gotenberg service on SmartCamp.AI VPS
  - Endpoint: `https://gotenberg.smartcamp.ai`
  - Authentication: Basic Auth (username: Bangla84PL, password: SmartCamp2025!)

#### Database & Auth
- **Database**: Supabase PostgreSQL (SmartCamp.AI VPS instance)
  - URL: `https://api.supabase.smartcamp.ai`
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage for PDF reports

#### AI & External APIs
- **AI Analysis**: Claude API (Anthropic) or OpenAI GPT-4
  - Use Claude Sonnet 4 for cost efficiency
  - Fallback to GPT-4 if Claude fails
- **SEO Data**: Google PageSpeed Insights API (free)
- **Traffic Data**: 
  - SimilarWeb API (free tier) OR
  - Manual scraping of publicly available data OR
  - Use AI to estimate based on content signals
- **Technical Checks**: 
  - Custom Node.js checks (HTTPS, headers, meta tags)
  - Lighthouse API (via PageSpeed Insights)

### 7.3 Integrations

#### Required Integrations
1. **Supabase** (SmartCamp.AI VPS)
   - Database: Store users, analyses, metadata
   - Auth: User authentication and session management
   - Storage: PDF file storage in `website-analysis-reports` bucket

2. **Redis** (SmartCamp.AI VPS)
   - Rate limiting data
   - Connection: Direct connection to VPS Redis instance
   - Data structure: IP-based keys with TTL

3. **Gotenberg** (SmartCamp.AI VPS)
   - PDF generation from HTML
   - Endpoint: `https://gotenberg.smartcamp.ai/forms/chromium/convert/html`
   - Authentication: Basic Auth

4. **Claude API** (Primary AI)
   - Website content analysis
   - Business model assessment
   - Recommendations generation
   - API Key: Store in environment variables

5. **Google PageSpeed Insights API**
   - Performance metrics
   - SEO technical checks
   - Free tier (no API key required, but rate limited)

#### Optional/Fallback Integrations
- **OpenAI GPT-4**: Fallback if Claude API fails
- **SimilarWeb API**: Traffic estimation (free tier)
- **Alternative SEO APIs**: If PageSpeed Insights insufficient

### 7.4 Infrastructure & Hosting

#### Frontend Hosting
- **Platform**: Vercel
- **Deployment**: Automatic deployment from `main` branch
- **Environment**: Production only for MVP (no staging)
- **Domain**: Custom domain (e.g., `webinsight.smartcamp.ai` or separate domain)

#### Backend Services (SmartCamp.AI VPS)
From `VPS_TECHNICAL_DOCUMENTATION.md`, we'll use:
- **Supabase**: Complete database + auth + storage stack
  - API URL: `https://api.supabase.smartcamp.ai`
  - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUxNzk0MzAwLCJleHAiOjIwNjcxNTQzMDB9.OuEL1wHusMc323PhIe_pjbme3DSstlWn5DB0m9uorTc`
  - Service Role Key: (stored in env vars, not exposed)
- **Gotenberg**: PDF generation service
  - URL: `https://gotenberg.smartcamp.ai`
  - Auth: Basic (see credentials above)
- **Redis**: Rate limiting (accessed via internal VPS network or exposed endpoint)

#### Networking & SSL
- All VPS services behind Traefik reverse proxy with automatic SSL
- Vercel frontend communicates with VPS services via HTTPS
- CORS configuration in Supabase to allow Vercel domain

#### Monitoring & Backups
- VPS has automated backups via existing backup system
- Vercel provides frontend deployment logs
- Consider adding Sentry for error tracking (post-MVP)

### 7.5 Authentication & Security

#### User Authentication
- Email/password via Supabase Auth
- Email verification required for new accounts
- Secure password requirements (min 8 chars, complexity)
- Session management via HTTP-only cookies
- JWT tokens for API authentication

#### Security Measures
- **HTTPS**: All traffic encrypted (Vercel + VPS Traefik)
- **CORS**: Strict CORS policy for API routes
- **Rate Limiting**: Redis-based IP rate limiting for anonymous users
- **SQL Injection**: Supabase ORM prevents SQL injection
- **XSS Prevention**: React escapes output by default
- **CSRF**: Next.js API routes protected
- **Environment Variables**: All secrets in `.env.local` (never committed)
- **API Key Rotation**: Document process for rotating Claude/OpenAI keys
- **Content Security Policy**: Implement CSP headers in Vercel config

#### Data Privacy
- No tracking cookies for anonymous users (only rate limiting)
- User data stored in Supabase (compliant with GDPR via user controls)
- Users can delete their account and all associated data
- Privacy policy page (simple, clear language)

## 8. Data Model

### Tables (Supabase PostgreSQL)

#### 1. `users` (Managed by Supabase Auth)
```sql
-- Automatically created by Supabase Auth
id: uuid (PK)
email: string
created_at: timestamp
-- ... other Supabase Auth fields
```

#### 2. `analyses`
```sql
CREATE TABLE analyses (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id: uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  url: text NOT NULL,
  normalized_url: text NOT NULL, -- canonical URL
  created_at: timestamptz DEFAULT now(),
  status: text DEFAULT 'completed', -- 'pending', 'completed', 'error'
  error_message: text,
  
  -- Analysis Results (stored as JSON for flexibility)
  seo_data: jsonb,
  technical_data: jsonb,
  traffic_data: jsonb,
  business_analysis: jsonb,
  
  -- PDF Storage
  pdf_url: text, -- Supabase Storage URL
  pdf_size: integer, -- bytes
  
  -- Metadata
  processing_time: integer, -- milliseconds
  api_calls_made: jsonb -- track which APIs were called
);

-- Indexes
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_normalized_url ON analyses(normalized_url);
```

#### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analyses
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);
```

### Storage Buckets (Supabase Storage)

#### `website-analysis-reports` bucket
- **Purpose**: Store generated PDF reports
- **Path structure**: `{user_id}/{analysis_id}.pdf`
- **Security**: 
  - Public read access via signed URLs (temporary, 1 hour expiry)
  - Write access only for authenticated users (via service role key in backend)
- **Storage policies**:
```sql
-- Users can read their own PDFs
CREATE POLICY "Users can download own reports"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'website-analysis-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Redis Data Structures

#### Rate Limiting Keys
```
Pattern: rate_limit:{ip_address}:hour
Value: count (integer)
TTL: 3600 seconds (1 hour)

Pattern: rate_limit:{ip_address}:day
Value: count (integer)
TTL: 86400 seconds (24 hours)
```

## 9. UI/UX Requirements

### Design Principles
- **Speed**: Analysis should feel instant; use optimistic UI patterns
- **Clarity**: Results should be scannable and actionable
- **Trust**: Professional design conveys credibility and accuracy
- **Simplicity**: Minimal clicks from URL input to PDF download

### Branding & Visual Identity
- **Use Standard SmartCamp.AI Branding**:
  - Logo, typography, and color palette from SmartCamp.AI brand guidelines
  - Primary colors, fonts, and visual style consistent with SmartCamp.AI ecosystem
  - Professional, modern, tech-forward aesthetic

### Global Footer Requirement
- **All main views must display**:
  - Footer text: `© Created with ❤️ by SmartCamp.AI`
  - Footer links to: `https://smartcamp.ai`
  - Style: Subtle, bottom-fixed or bottom-of-page, not intrusive
  - Present on: Homepage, Results page, Dashboard, Auth pages

### Key Screens/Views

#### 1. Homepage (Unauthenticated)
**Layout**:
- Hero section:
  - Headline: "Analyze Any Website's Business Potential in Seconds"
  - Subheadline: "Get SEO, technical, traffic, and AI-powered business insights in one comprehensive report"
  - Large URL input field with placeholder "Enter website URL (e.g., example.com)"
  - Primary CTA button: "Analyze Now" (prominent, high contrast)
  - Rate limit indicator: "3 free analyses per hour • 10 per day"
- Benefits section (3 columns):
  - "Comprehensive Analysis" - SEO, technical, traffic, business model
  - "AI-Powered Insights" - Smart recommendations from Claude AI
  - "Instant PDF Reports" - Professional reports in seconds
- How it works (3 steps):
  - 1. Enter URL → 2. AI Analysis → 3. Download Report
- Social proof (if available): "X analyses performed" or testimonials
- Footer with SmartCamp.AI attribution

#### 2. Homepage (Authenticated)
**Changes from unauthenticated**:
- Header shows: "Welcome back, [Name]" + "Dashboard" + "Logout" buttons
- Hero section includes: "Your analyses are automatically saved"
- Quick access: "View Dashboard" button below analyze CTA

#### 3. Loading/Analysis Screen
**Layout**:
- Full-page modal or dedicated page
- Animated progress indicator (not actual progress - indeterminate spinner)
- Status messages cycling through:
  - "Fetching website data..."
  - "Analyzing SEO performance..."
  - "Running technical checks..."
  - "Estimating traffic..."
  - "AI is evaluating business model..."
  - "Generating your report..."
- Estimated time: "Usually takes 30-45 seconds"
- Cannot be dismissed (prevent duplicate requests)

#### 4. Results Page
**Layout**:
- Header: Website URL, analysis date/time
- Key Metrics Grid (4-6 cards):
  - SEO Score (0-100)
  - Performance Score (0-100)
  - Estimated Monthly Visitors
  - Business Model Type
- Tabbed sections (or accordion):
  - Executive Summary (AI-generated)
  - SEO Analysis
  - Technical Analysis
  - Traffic & Audience
  - Business Model & Recommendations
- Primary CTA: "Download Full PDF Report" (sticky button)
- For unauthenticated users: "Sign up to save this analysis" banner
- For authenticated users: "Analysis saved to dashboard" success message
- Footer with SmartCamp.AI attribution

#### 5. Dashboard (Authenticated Only)
**Layout**:
- Header: "Your Analysis History"
- Stats row (optional for MVP):
  - Total analyses performed
  - Most analyzed domain (if multiple)
- Analysis table/list:
  - Columns: Website URL | Date | Actions
  - URL: Clickable, opens website in new tab
  - Date: Relative time (e.g., "2 hours ago", "Yesterday")
  - Actions: "View Report" (download PDF), "Delete" (trash icon)
- Search bar: "Search by URL"
- Pagination: "Showing 1-20 of X analyses"
- Empty state: "No analyses yet. Start analyzing websites!" + "Analyze New Website" CTA
- Footer with SmartCamp.AI attribution

#### 6. Authentication Pages
**Sign Up**:
- Clean form: Email, Password, Confirm Password
- Submit button: "Create Free Account"
- Link: "Already have an account? Log in"
- Terms acceptance checkbox (optional for MVP)

**Login**:
- Clean form: Email, Password
- Submit button: "Log In"
- Link: "Don't have an account? Sign up"
- Link: "Forgot password?"

**Password Reset**:
- Email input form
- Submit button: "Send Reset Link"
- Success message: "Check your email for reset instructions"

### Interaction Patterns
- **Loading states**: Skeleton screens or spinners for all async operations
- **Error handling**: Toast notifications for errors (top-right corner)
- **Success feedback**: Green checkmark + message for successful actions
- **Confirmation dialogs**: For destructive actions (delete analysis)
- **Responsive tables**: Stack table data on mobile, swipe to reveal actions
- **Smooth transitions**: Fade-in for results, slide-in for modals

### Accessibility Requirements
- **WCAG 2.1 AA compliance**:
  - Color contrast ratios meet standards (4.5:1 for text)
  - All interactive elements keyboard accessible
  - Proper heading hierarchy (h1 → h2 → h3)
  - Alt text for all images
  - ARIA labels for icon buttons
  - Focus indicators visible
- **Screen reader support**: Semantic HTML, ARIA landmarks
- **Keyboard navigation**: Tab order logical, Enter/Space to activate buttons
- **Form validation**: Clear error messages, inline validation

## 10. Non-Functional Requirements

### Performance Expectations
- **Page Load**: First Contentful Paint < 1.5s (Vercel edge network)
- **Time to Interactive**: < 3s on 3G connection
- **Analysis Completion**: 90% of analyses complete in < 45s
- **PDF Generation**: < 10s from HTML to downloadable PDF
- **Dashboard Load**: < 2s to render 20 analyses
- **API Response**: Backend API routes respond in < 500ms (excluding external API calls)

### Scalability Needs
- **Concurrent Users**: Support 50 concurrent analyses (MVP)
- **Database**: Supabase can handle thousands of analyses (no concern for MVP)
- **Redis**: Handle 1000+ rate limit checks per minute
- **PDF Storage**: Supabase Storage can scale to GBs (no concern for MVP)
- **Future Scaling**: Architecture allows horizontal scaling via Vercel serverless functions

### Security Standards
- **Data Encryption**: 
  - In transit: TLS 1.3 (Vercel + VPS Traefik)
  - At rest: Supabase encrypted storage
- **Password Storage**: Bcrypt hashing via Supabase Auth
- **Session Security**: HTTP-only cookies, SameSite=Strict
- **API Keys**: All secrets in environment variables, never in code
- **Dependency Scanning**: Use Dependabot or Snyk (post-MVP)
- **Regular Updates**: Keep dependencies updated monthly

### Browser/Device Compatibility
- **Desktop Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Screen Sizes**: 
  - Mobile: 375px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- **Responsive Breakpoints**: Use Tailwind's default breakpoints

### Deployment & Hosting Notes
- **Frontend**: 
  - Hosted on Vercel (automatic HTTPS, global CDN)
  - Environment variables stored in Vercel dashboard
  - Deploy from GitHub repository (main branch)
- **Backend Services**: 
  - SmartCamp.AI VPS provides Supabase, Redis, Gotenberg
  - All services behind Traefik reverse proxy with Let's Encrypt SSL
  - Supabase CORS configured to allow Vercel domain
  - Redis connection via internal VPS network or secure endpoint
- **Database Migrations**: 
  - Use Supabase CLI or SQL migrations in Supabase dashboard
  - Version control migrations in repo
- **Monitoring**: 
  - Vercel provides deployment and runtime logs
  - Supabase provides database query logs
  - Consider adding Sentry for error tracking (post-MVP)

## 11. Constraints & Assumptions

### Constraints
- **Free API Limits**: 
  - Claude API: Rate limits and token limits (need to monitor costs)
  - Google PageSpeed Insights: 25,000 requests per day (should be sufficient)
  - Must handle API failures gracefully
- **PDF File Size**: Gotenberg generates variable-size PDFs; optimize HTML template to keep under 2MB
- **VPS Resources**: Redis and Gotenberg share VPS resources; monitor CPU/memory usage
- **Vercel Limits**: 
  - Serverless function timeout: 60s (Hobby tier) or 300s (Pro tier)
  - Need to complete analysis within timeout
- **No Backend Framework**: Using Next.js API routes limits complex background job processing (consider n8n for future enhancements)

### Assumptions
- **Valid URLs**: Users will primarily enter valid, accessible websites
- **English Content**: AI analysis optimized for English websites (expand language support post-MVP)
- **Public Websites**: Tool designed for public websites, not authenticated/paywalled content
- **Stable APIs**: External APIs (PageSpeed, Claude) will maintain reasonable uptime
- **User Behavior**: Most users will analyze 1-3 websites per session
- **PDF Preference**: Users prefer downloadable PDFs over in-app viewing (validate this assumption)
- **VPS Uptime**: SmartCamp.AI VPS maintains >99% uptime
- **No Mobile App**: Web-first approach; responsive web app sufficient for MVP

## 12. Out of Scope (MVP)

The following features are explicitly **NOT included** in MVP but may be considered for future releases:

### Features Not Included
- ❌ **Social Authentication**: Google/GitHub OAuth (only email/password for MVP)
- ❌ **Team Workspaces**: Multi-user collaboration and sharing
- ❌ **API Access**: Developer API for programmatic access
- ❌ **Scheduled Monitoring**: Automated recurring analyses and alerts
- ❌ **Competitor Comparison**: Side-by-side analysis of multiple websites
- ❌ **Custom Branding**: White-label reports for agencies
- ❌ **Export Formats**: Excel, JSON, CSV exports (only PDF)
- ❌ **Advanced Filtering**: Filter analyses by date range, score, domain
- ❌ **Bulk Analysis**: Upload CSV of URLs for batch processing
- ❌ **Historical Tracking**: Track changes in metrics over time
- ❌ **Premium Integrations**: Ahrefs, SEMrush, paid traffic APIs
- ❌ **Mobile Apps**: Native iOS/Android apps
- ❌ **Internationalization**: Multi-language support (English only)
- ❌ **Admin Dashboard**: Internal analytics and user management
- ❌ **Payment Integration**: Subscription/payment system (all free for MVP)

### Technical Scope Limitations
- ❌ **Real-time Analysis**: No WebSocket updates during analysis (simple polling acceptable)
- ❌ **Caching Layer**: No Redis caching for analysis results (can add later if needed)
- ❌ **CDN for PDFs**: PDFs served directly from Supabase Storage (no CloudFront/CDN)
- ❌ **Background Jobs**: No queue system (n8n could be added post-MVP)
- ❌ **Advanced Error Tracking**: Basic error handling only (no Sentry/DataDog)
- ❌ **A/B Testing**: No experimentation framework
- ❌ **Analytics Dashboard**: No internal business metrics dashboard

## 13. Development Phases

### Phase 1: Foundation (Days 1-3)
**Goal**: Set up infrastructure and basic functionality

**Tasks**:
- [ ] Initialize Next.js project with TypeScript + Tailwind
- [ ] Set up Supabase integration (auth + database)
- [ ] Create database schema and RLS policies
- [ ] Implement Supabase Storage bucket for PDFs
- [ ] Configure Redis connection for rate limiting
- [ ] Set up environment variables (Vercel + local)
- [ ] Create basic UI layout with SmartCamp.AI branding
- [ ] Implement global footer component

**Deliverables**:
- Working Next.js app deployed to Vercel
- Database tables created in Supabase
- Authentication flow (signup/login/logout) functional
- Footer present on all pages

### Phase 2: Core Analysis Engine (Days 4-7)
**Goal**: Build website analysis functionality

**Tasks**:
- [ ] Implement URL normalization and validation
- [ ] Create API route for triggering analysis
- [ ] Integrate Google PageSpeed Insights API (SEO + technical data)
- [ ] Build custom technical checks (HTTPS, headers, meta tags)
- [ ] Integrate Claude API for business model analysis
- [ ] Implement error handling and retries for external APIs
- [ ] Create analysis results data structure (JSON schema)
- [ ] Store analysis results in Supabase database

**Deliverables**:
- API endpoint: `POST /api/analyze` accepting URL
- Analysis completes in < 60s
- Results stored in database with proper structure

### Phase 3: Rate Limiting (Days 7-8)
**Goal**: Implement IP-based rate limiting for anonymous users

**Tasks**:
- [ ] Set up Redis client in Next.js
- [ ] Implement rate limiting middleware using Redis
- [ ] Track hourly limit (3 requests) and daily limit (10 requests)
- [ ] Create clear error responses when limits exceeded
- [ ] Display remaining analyses in UI
- [ ] Bypass rate limiting for authenticated users
- [ ] Test rate limiting with multiple IP addresses

**Deliverables**:
- Rate limiting active for anonymous users
- Clear UI feedback for remaining analyses
- Authenticated users not rate limited

### Phase 4: PDF Generation (Days 8-10)
**Goal**: Generate professional PDF reports

**Tasks**:
- [ ] Design HTML template for PDF report
- [ ] Include all analysis sections: SEO, technical, traffic, business model
- [ ] Add charts/visualizations (CSS-based or simple SVG)
- [ ] Add footer to every PDF page: "© Created with ❤️ by SmartCamp.AI" (linking to https://smartcamp.ai)
- [ ] Integrate Gotenberg API with Basic Auth
- [ ] Upload generated PDFs to Supabase Storage
- [ ] Return signed URL for PDF download
- [ ] Handle Gotenberg failures gracefully

**Deliverables**:
- PDF generation working end-to-end
- PDFs stored in Supabase Storage
- Download link provided to users

### Phase 5: User Dashboard (Days 10-12)
**Goal**: Build analysis history dashboard for authenticated users

**Tasks**:
- [ ] Create dashboard page (`/dashboard`)
- [ ] Fetch user's analyses from Supabase (with RLS)
- [ ] Display analyses in table/list format
- [ ] Implement search and pagination
- [ ] Add "View Report" button (re-download PDF)
- [ ] Add "Delete" functionality with confirmation
- [ ] Create empty state for new users
- [ ] Ensure footer present on dashboard

**Deliverables**:
- Dashboard accessible only to authenticated users
- Users can view and download past reports
- Users can delete analyses

### Phase 6: UI Polish & Testing (Days 12-14)
**Goal**: Refine UI/UX and conduct thorough testing

**Tasks**:
- [ ] Implement loading states for all async operations
- [ ] Add error handling UI (toast notifications)
- [ ] Improve responsive design (mobile optimization)
- [ ] Add accessibility improvements (ARIA labels, keyboard nav)
- [ ] Test with various website URLs (edge cases)
- [ ] Test rate limiting thoroughly
- [ ] Test authentication flows (signup, login, password reset)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Performance optimization (code splitting, image optimization)
- [ ] Write basic documentation (README)

**Deliverables**:
- Polished, responsive UI
- All major bugs fixed
- Cross-browser compatibility verified
- Ready for MVP launch

### Phase 7: Launch Preparation (Day 14)
**Goal**: Final checks and deployment

**Tasks**:
- [ ] Final security review (environment variables, RLS policies)
- [ ] Set up custom domain (if applicable)
- [ ] Configure DNS and SSL
- [ ] Create privacy policy and terms of service pages
- [ ] Set up basic analytics (Vercel Analytics or Google Analytics)
- [ ] Prepare launch announcement (social media, email)
- [ ] Monitor first 24 hours for errors

**Deliverables**:
- Live production deployment
- Monitoring in place
- Launch announcement ready

## 14. Appendix

### A. Technical References

#### Supabase Integration (SmartCamp.AI VPS)
- **Documentation**: See `VPS_TECHNICAL_DOCUMENTATION.md` for full Supabase configuration
- **API URL**: `https://api.supabase.smartcamp.ai`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUxNzk0MzAwLCJleHAiOjIwNjcxNTQzMDB9.OuEL1wHusMc323PhIe_pjbme3DSstlWn5DB0m9uorTc`
- **Service Role Key**: Store in `SUPABASE_SERVICE_ROLE_KEY` environment variable (see VPS docs)

#### Gotenberg Integration (SmartCamp.AI VPS)
- **Documentation**: See `VPS_TECHNICAL_DOCUMENTATION.md` for Gotenberg service details
- **Endpoint**: `https://gotenberg.smartcamp.ai/forms/chromium/convert/html`
- **Authentication**: Basic Auth
  - Username: `Bangla84PL`
  - Password: `SmartCamp2025!`
- **Usage**: 
  ```typescript
  const formData = new FormData();
  formData.append('files', new Blob([htmlContent], { type: 'text/html' }), 'index.html');
  
  const response = await fetch('https://gotenberg.smartcamp.ai/forms/chromium/convert/html', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from('Bangla84PL:SmartCamp2025!').toString('base64')}`
    },
    body: formData
  });
  ```

#### Redis Configuration
- **Connection**: Refer to VPS documentation for Redis endpoint/connection details
- **Rate Limiting Library**: `@upstash/ratelimit` or custom implementation
- **Data Structure**:
  ```
  Key: rate_limit:{ip}:hour
  Value: count
  TTL: 3600 seconds
  
  Key: rate_limit:{ip}:day
  Value: count
  TTL: 86400 seconds
  ```

#### Claude API
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Model**: `claude-sonnet-4-20250514` (cost-efficient)
- **Prompt Template** (example):
  ```
  Analyze the following website content and provide a comprehensive business assessment:
  
  URL: {url}
  Content: {website_content}
  
  Provide:
  1. Primary business model (SaaS, e-commerce, content/ads, lead generation, etc.)
  2. Target audience
  3. Key value propositions
  4. Competitive advantages
  5. Top 3-5 improvement recommendations
  
  Format your response as structured JSON.
  ```

### B. Example Analysis Output Structure

```json
{
  "url": "https://example.com",
  "normalized_url": "https://example.com",
  "timestamp": "2025-11-17T10:30:00Z",
  "seo_data": {
    "title": "Example Domain",
    "meta_description": "Example site description",
    "h1_tags": ["Example Heading"],
    "seo_score": 75,
    "issues": [
      "Missing alt text on 3 images",
      "No robots.txt found"
    ],
    "recommendations": [
      "Add meta description to homepage",
      "Optimize title tags for target keywords"
    ]
  },
  "technical_data": {
    "performance_score": 85,
    "https_enabled": true,
    "mobile_friendly": true,
    "page_load_time": 1.2,
    "security_headers": {
      "content_security_policy": false,
      "x_frame_options": true
    }
  },
  "traffic_data": {
    "estimated_monthly_visitors": 50000,
    "top_countries": ["US", "UK", "CA"],
    "traffic_sources": {
      "direct": 40,
      "search": 35,
      "referral": 25
    }
  },
  "business_analysis": {
    "business_model": "SaaS",
    "target_audience": "Small business owners",
    "value_proposition": "Simplified project management",
    "competitive_advantages": [
      "Intuitive UI",
      "Affordable pricing"
    ],
    "recommendations": [
      "Add social proof (testimonials)",
      "Improve mobile conversion funnel",
      "Create comparison page vs competitors"
    ]
  }
}
```

### C. Environment Variables Checklist

```bash
# Supabase (SmartCamp.AI VPS)
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (from VPS docs)

# Redis (SmartCamp.AI VPS)
REDIS_URL=redis://[VPS_REDIS_HOST]:[PORT]
# OR if using Upstash Redis:
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Gotenberg (SmartCamp.AI VPS)
GOTENBERG_URL=https://gotenberg.smartcamp.ai
GOTENBERG_USERNAME=Bangla84PL
GOTENBERG_PASSWORD=SmartCamp2025!

# AI APIs
ANTHROPIC_API_KEY=sk-ant-... (your Claude API key)
OPENAI_API_KEY=sk-... (fallback, optional)

# Optional (if using paid APIs)
GOOGLE_PAGESPEED_API_KEY=... (optional, free tier works without key)
SIMILARWEB_API_KEY=... (optional)

# Application
NEXT_PUBLIC_APP_URL=https://webinsight.smartcamp.ai (or your domain)
```

### D. Success Criteria for MVP Launch

#### Technical Success
- ✅ User can analyze a website and receive PDF in < 60 seconds
- ✅ Rate limiting works correctly (3/hour, 10/day for anonymous)
- ✅ Authentication flow works (signup, login, logout, password reset)
- ✅ Dashboard displays saved analyses correctly
- ✅ PDFs are generated and stored successfully
- ✅ App is responsive on mobile, tablet, desktop
- ✅ No critical bugs or errors in production

#### User Experience Success
- ✅ Landing page clearly communicates value proposition
- ✅ Analysis process feels fast and professional
- ✅ PDF reports are comprehensive and actionable
- ✅ Error messages are clear and helpful
- ✅ UI is intuitive (no user confusion)

#### Business Success
- ✅ 100+ analyses performed in first 30 days
- ✅ 10%+ conversion to registered users
- ✅ Positive user feedback (via email or social media)
- ✅ No major infrastructure issues or downtime

### E. Post-MVP Roadmap (Future Considerations)

#### Short-term (1-3 months)
1. **Social Authentication**: Add Google OAuth for faster signup
2. **Enhanced SEO Data**: Integrate Ahrefs or SEMrush API (paid tier)
3. **Traffic Insights**: Deeper traffic analysis with better data sources
4. **Monitoring & Alerts**: Track website changes over time, email alerts
5. **Shareable Reports**: Generate unique public links for sharing analyses

#### Medium-term (3-6 months)
1. **Competitor Comparison**: Side-by-side analysis of up to 3 websites
2. **API Access**: Developer API for programmatic access
3. **Team Workspaces**: Multi-user collaboration features
4. **Premium Tier**: Subscription model with unlimited analyses + advanced features
5. **Export Formats**: Excel, JSON in addition to PDF

#### Long-term (6-12 months)
1. **White-label Solution**: Allow agencies to rebrand the tool
2. **Mobile Apps**: Native iOS and Android apps
3. **Scheduled Monitoring**: Automated recurring analyses
4. **AI Chat Interface**: Ask questions about any website
5. **Integration Marketplace**: Connect with CRM, project management tools

---

**Document Version**: 1.0  
**Last Updated**: November 17, 2025  
**Status**: Ready for Development  
**Estimated Development Time**: 14 days  
**Target Launch**: December 1, 2025
