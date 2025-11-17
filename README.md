# WebInsight Analyzer

**Comprehensive website analysis tool powered by AI**

Get SEO, technical, traffic, and AI-powered business insights in one comprehensive PDF report.

## 🎯 Overview

WebInsight Analyzer is a Next.js application that provides instant, actionable insights about any website's business potential. It consolidates SEO metrics, technical analysis, traffic estimates, and AI-powered business model assessment into a single professional PDF report.

### Key Features

- 🔍 **Comprehensive SEO Analysis** - Meta tags, headings, technical SEO factors
- ⚡ **Performance Metrics** - Page speed, mobile-friendliness, Core Web Vitals
- 📊 **Traffic Estimation** - Visitor estimates and traffic source breakdown
- 🤖 **AI Business Analysis** - Claude AI evaluates business model and provides recommendations
- 📄 **Professional PDF Reports** - Downloadable, shareable reports
- 🔐 **User Authentication** - Save analysis history and access past reports
- 🚦 **Rate Limiting** - Anonymous users: 3/hour, 10/day | Authenticated: Unlimited

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with SmartCamp.AI branding
- **Database & Auth**: Supabase (self-hosted on SmartCamp.AI VPS)
- **File Storage**: Supabase Storage
- **Rate Limiting**: Redis (SmartCamp.AI VPS)
- **PDF Generation**: Gotenberg (SmartCamp.AI VPS)
- **AI Analysis**: Claude API (Anthropic) primary, OpenAI GPT-4 fallback
- **Deployment**: Vercel (frontend), SmartCamp.AI VPS (backend services)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Access to SmartCamp.AI VPS services (Supabase, Redis, Gotenberg)
- Claude API key (from Anthropic)
- Optional: OpenAI API key (fallback)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web-insight-analyzer

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure environment variables (see below)
nano .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

All required environment variables are documented in `.env.example`. Key variables:

```bash
# Supabase (SmartCamp.AI VPS)
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Redis (SmartCamp.AI VPS)
REDIS_URL=redis://srv867044.hstgr.cloud:6379

# Gotenberg (SmartCamp.AI VPS)
GOTENBERG_URL=https://gotenberg.smartcamp.ai
GOTENBERG_USERNAME=Bangla84PL
GOTENBERG_PASSWORD=SmartCamp2025!

# AI APIs
ANTHROPIC_API_KEY=<your-claude-api-key>
OPENAI_API_KEY=<your-openai-api-key> # Optional

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Project Structure

```
web-insight-analyzer/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── analyze/          # Main analysis endpoint
│   │   └── auth/             # Authentication callbacks
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/            # User dashboard
│   ├── results/[id]/         # Analysis results page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles (SmartCamp branding)
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── analyze-form.tsx      # URL analysis form
│   └── footer.tsx            # Global footer
├── lib/                      # Utility functions
│   ├── ai/                   # AI integrations (Claude)
│   ├── analyzers/            # PageSpeed, scraper
│   ├── pdf/                  # PDF generation
│   ├── redis/                # Rate limiting
│   ├── supabase/             # Database & auth
│   └── utils.ts              # Common utilities
├── types/                    # TypeScript type definitions
├── branding/                 # SmartCamp.AI brand assets
└── public/                   # Static assets
```

## 🗄️ Database Setup

WebInsight Analyzer uses Supabase with project-specific table naming. See `SUPABASE_SETUP.md` for detailed setup instructions.

### Key Tables

- **`webinsight_analyses`** - Analysis records with results and PDFs
- Uses **`webinsight_`** prefix for multi-project VPS setup
- Row Level Security (RLS) enabled for data isolation

### Storage Buckets

- **`webinsight_reports`** - PDF storage with signed URL access

## 🔒 Security

- **Row Level Security (RLS)** - Users can only access their own data
- **Rate Limiting** - IP-based limits for anonymous users
- **HTTPS Only** - All services behind Traefik with SSL
- **Environment Variables** - Secrets never committed to repository
- **JWT Authentication** - Supabase handles user sessions

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 📚 Documentation

- **`SUPABASE_SETUP.md`** - Detailed database and storage configuration
- **`DEPLOYMENT.md`** - Production deployment guide
- **`DECISIONS.md`** - Technical decisions and rationale
- **`PROGRESS.md`** - Development progress and completion status
- **`CLAUDE.md`** - Guidelines for Claude Code (project instructions)
- **`VPS_CONFIGURATION_GUIDE.md`** - VPS infrastructure details

## 🤝 Contributing

This is a proprietary SmartCamp.AI project. For questions or issues, contact hello@smartcamp.ai.

## 📄 License

Proprietary - © 2025 SmartCamp.AI

---

**Built with ❤️ by SmartCamp.AI**

AI | Automations | Web Dev

https://smartcamp.ai
