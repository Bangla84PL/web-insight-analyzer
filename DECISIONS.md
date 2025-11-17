# Technical Decisions - WebInsight Analyzer

This document records all significant technical decisions made during the autonomous development of WebInsight Analyzer.

---

## 🏗️ Architecture Decisions

### 1. Next.js App Router over Pages Router
**Decision:** Use Next.js 14 App Router instead of Pages Router

**Rationale:**
- Modern React Server Components support
- Better performance with streaming SSR
- Improved data fetching patterns
- Native middleware support
- Future-proof architecture

**Trade-offs:**
- Slightly steeper learning curve
- Some third-party libraries not yet optimized
- Client components require 'use client' directive

---

### 2. Supabase for Database & Auth
**Decision:** Use Supabase (self-hosted on VPS) instead of alternatives

**Rationale:**
- Already deployed on SmartCamp.AI VPS
- PostgreSQL with excellent JSON support
- Built-in authentication system
- Row Level Security for data isolation
- File storage included

**Trade-offs:**
- Vendor-specific features (not database-agnostic)
- Requires VPS maintenance
- Multi-project setup needs careful namespacing

---

### 3. Redis for Rate Limiting
**Decision:** Use Redis with in-memory fallback

**Rationale:**
- Fast, atomic operations for counters
- TTL support for automatic cleanup
- Shared state across serverless functions
- In-memory fallback for development

**Trade-offs:**
- Additional infrastructure dependency
- Requires VPS Redis instance
- Fallback has limited accuracy in distributed environments

---

### 4. Gotenberg for PDF Generation
**Decision:** Use Gotenberg service instead of browser-based PDF libraries

**Rationale:**
- Already deployed on SmartCamp.AI VPS
- Reliable HTML-to-PDF conversion
- Better rendering than client-side libraries
- Supports complex CSS and layouts
- No Chromium/Puppeteer in serverless functions

**Trade-offs:**
- External service dependency
- Network latency for PDF generation
- Requires VPS service availability

---

### 5. Claude API as Primary AI
**Decision:** Use Claude (Anthropic) as primary AI with OpenAI as fallback

**Rationale:**
- Excellent at business analysis and recommendations
- Structured JSON output support
- Cost-effective compared to GPT-4
- Strong reasoning capabilities
- PRD specified Claude as primary

**Trade-offs:**
- Requires API key and credits
- Rate limits apply
- Fallback adds complexity

---

## 🎨 Design Decisions

### 6. Glass Morphism UI Pattern
**Decision:** Use translucent glass morphism instead of solid backgrounds

**Rationale:**
- SmartCamp.AI branding requirement
- Modern, premium aesthetic
- Allows jungle background to show through
- Creates depth and visual interest

**Trade-offs:**
- Requires backdrop-filter support (not in older browsers)
- More complex CSS
- Potential readability issues if not carefully managed

---

### 7. Jost as Primary Font
**Decision:** Use Jost (Google Fonts) exclusively

**Rationale:**
- SmartCamp.AI brand specification
- Modern geometric sans-serif
- Good readability on translucent backgrounds
- Multiple weights available
- Free and easily accessible

**Trade-offs:**
- External font loading (performance impact)
- No fallback font family

---

### 8. White/Transparency Color System
**Decision:** Use white with varying opacity instead of color variations

**Rationale:**
- SmartCamp.AI branding requirement
- Consistent with glass morphism
- Simplified color palette
- Emerald green as only accent color

**Trade-offs:**
- Limited color expression
- Requires careful contrast management
- Not suitable for all use cases

---

## 💾 Data & Storage Decisions

### 9. JSON Columns for Analysis Data
**Decision:** Store analysis results as JSONB instead of normalized tables

**Rationale:**
- Flexible schema for evolving analysis data
- Faster development (no migrations for structure changes)
- PostgreSQL JSONB is performant and indexable
- Analysis data is mostly read-only after creation

**Trade-offs:**
- Less type safety at database level
- More complex queries for nested data
- Potential for inconsistent data structures

---

### 10. Project Namespacing (webinsight_ prefix)
**Decision:** Prefix all database objects with `webinsight_`

**Rationale:**
- Shared Supabase instance across multiple projects
- Clear separation and discoverability
- Prevents naming conflicts
- Easy to identify project resources

**Trade-offs:**
- Longer object names
- More typing in queries
- Not necessary for dedicated database

---

### 11. Signed URLs for PDF Access
**Decision:** Use temporary signed URLs (1 hour expiry) instead of public URLs

**Rationale:**
- Security - prevents unauthorized PDF access
- Controlled access duration
- Allows bucket to remain private
- Supabase best practice

**Trade-offs:**
- URLs expire after 1 hour
- Requires regeneration for extended access
- More complex than public URLs

---

## 🔒 Security Decisions

### 12. IP-Based Rate Limiting for Anonymous Users
**Decision:** Implement 3/hour, 10/day limits based on IP address

**Rationale:**
- Prevents abuse without requiring signup
- PRD specification
- Incentivizes user registration
- Protects API quota and costs

**Trade-offs:**
- Can be bypassed with VPN/proxy
- May affect legitimate users behind shared IPs
- Requires Redis infrastructure

---

### 13. Row Level Security (RLS) for Data Isolation
**Decision:** Enable RLS on all user data tables

**Rationale:**
- Database-level security (defense in depth)
- Prevents data leaks even if application bugs
- Supabase best practice
- Automatic enforcement

**Trade-offs:**
- More complex queries
- Requires service role key for admin operations
- Can be difficult to debug

---

### 14. Environment Variables for All Secrets
**Decision:** Never hardcode credentials, use environment variables

**Rationale:**
- Security best practice
- Easy to rotate credentials
- Different values per environment
- Prevents accidental git commits

**Trade-offs:**
- Requires secure environment variable management
- More setup complexity
- Can be forgotten during deployment

---

## 🚀 Performance Decisions

### 15. Parallel Data Fetching
**Decision:** Use `Promise.allSettled()` for concurrent API calls

**Rationale:**
- Reduces total analysis time
- PageSpeed and content scraping can run simultaneously
- Graceful degradation if one fails
- Better user experience

**Trade-offs:**
- More complex error handling
- Higher instant resource usage
- Potential rate limit issues

---

### 16. Server-Side Rendering (SSR) for Pages
**Decision:** Use React Server Components and SSR where possible

**Rationale:**
- Faster initial page load
- Better SEO
- Reduced client bundle size
- Next.js 14 optimization

**Trade-offs:**
- More server load
- Requires careful client/server separation
- Some features require client components

---

## 🧩 Component Decisions

### 17. shadcn/ui for UI Components
**Decision:** Use shadcn/ui instead of a complete component library

**Rationale:**
- Copy-paste components (full control)
- Built with Radix UI (accessibility)
- Customizable to match SmartCamp branding
- Modern and well-maintained

**Trade-offs:**
- Manual component installation
- Need to maintain component code
- No built-in theme system

---

### 18. Controlled Forms with React Hook Form
**Decision:** Use React Hook Form for form management

**Rationale:**
- Better performance than controlled forms
- Built-in validation with Zod
- Reduced re-renders
- Industry standard

**Trade-offs:**
- Additional dependency
- Learning curve for team members
- Overkill for simple forms

---

## 📝 Code Organization Decisions

### 19. Functional Components with Hooks
**Decision:** Use only functional components, no class components

**Rationale:**
- Modern React best practice
- Simpler code
- Better TypeScript support
- Hooks are more powerful than lifecycle methods

**Trade-offs:**
- Cannot use legacy class-based libraries
- Different mental model than older React

---

### 20. TypeScript Strict Mode
**Decision:** Enable strict TypeScript configuration

**Rationale:**
- Catch bugs at compile time
- Better IDE support
- Self-documenting code
- Industry best practice

**Trade-offs:**
- More initial development time
- Steeper learning curve
- Some libraries lack proper types

---

## 🔄 API Design Decisions

### 21. RESTful API Routes
**Decision:** Use REST-style API routes instead of GraphQL

**Rationale:**
- Simpler for this use case
- No need for complex data fetching
- Better Next.js integration
- Easier to understand and maintain

**Trade-offs:**
- Multiple endpoints for related data
- Potential over-fetching
- Less flexible for complex queries

---

### 22. JSON API Responses
**Decision:** Always return JSON with success/error structure

**Rationale:**
- Consistent response format
- Easy error handling on client
- Type-safe with TypeScript
- Industry standard

**Trade-offs:**
- Slightly more verbose
- Requires consistent structure across endpoints

---

## 📦 Deployment Decisions

### 23. Vercel for Frontend Hosting
**Decision:** Deploy frontend to Vercel

**Rationale:**
- Best Next.js integration (same company)
- Automatic deployments from git
- Edge network for performance
- Free tier sufficient for MVP
- PRD specification

**Trade-offs:**
- Vendor lock-in
- Serverless limitations (timeouts, cold starts)
- Cost can increase with scale

---

### 24. VPS for Backend Services
**Decision:** Use existing SmartCamp.AI VPS for Supabase, Redis, Gotenberg

**Rationale:**
- Infrastructure already exists
- Cost-effective (no per-request pricing)
- Full control over services
- Shared across SmartCamp projects

**Trade-offs:**
- Requires VPS maintenance
- Single point of failure
- Network latency from Vercel to VPS

---

## 🎯 Feature Decisions

### 25. Anonymous Analysis Support
**Decision:** Allow anonymous users to analyze websites (with rate limits)

**Rationale:**
- Lower barrier to entry
- Showcases product value before signup
- Competitive advantage
- PRD requirement

**Trade-offs:**
- Higher abuse potential
- More complex rate limiting
- Cannot save results for anonymous users

---

### 26. PDF-Only Reports
**Decision:** Generate PDF reports instead of HTML/web view

**Rationale:**
- Downloadable and shareable
- Professional format
- Consistent formatting
  - PRD specification
- Client expectation

**Trade-offs:**
- Cannot update reports after generation
- Slower than HTML rendering
- Accessibility challenges with PDFs

---

## 📊 Monitoring Decisions

### 27. Basic Error Handling without Monitoring Service
**Decision:** Use console logging and Next.js error boundaries

**Rationale:**
- Sufficient for MVP
- No additional cost
- Vercel provides basic logging
- Can add Sentry later if needed

**Trade-offs:**
- Limited error visibility
- No aggregated error tracking
- Harder to debug production issues
- Missing user context on errors

---

## 🔄 Future Considerations

Decisions that may be revisited:

1. **GraphQL API** - If data fetching becomes more complex
2. **Error Monitoring** - Add Sentry/DataDog for better observability
3. **Caching Layer** - Redis for analysis result caching
4. **Background Jobs** - Queue system for long-running analyses
5. **Real-time Updates** - WebSocket for live analysis progress
6. **Multi-language Support** - i18n for international users

---

**Last Updated:** November 17, 2025

**Review Frequency:** Quarterly or when significant changes occur

All decisions documented here represent the best judgment at the time of development based on project requirements, technical constraints, and industry best practices.
