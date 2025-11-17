# Supabase Setup Guide - WebInsight Analyzer

This guide provides step-by-step instructions for setting up the Supabase database schema and storage for WebInsight Analyzer on the SmartCamp.AI VPS.

## 🎯 Overview

WebInsight Analyzer uses a shared Supabase instance on the SmartCamp.AI VPS. To ensure clean separation from other projects, all tables and storage buckets use the **`webinsight_`** prefix.

## 📋 Prerequisites

- Access to Supabase Studio: `https://supabase.smartcamp.ai`
- Basic Auth credentials: Username `Bangla84PL`, Password `SmartCamp2025!`
- SQL Editor access in Supabase Studio

## 🗄️ Database Schema

### Step 1: Create Analysis Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create webinsight_analyses table
CREATE TABLE webinsight_analyses (
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

-- Create indexes for better query performance
CREATE INDEX idx_webinsight_analyses_user_id ON webinsight_analyses(user_id);
CREATE INDEX idx_webinsight_analyses_created_at ON webinsight_analyses(created_at DESC);
CREATE INDEX idx_webinsight_analyses_normalized_url ON webinsight_analyses(normalized_url);
CREATE INDEX idx_webinsight_analyses_status ON webinsight_analyses(status);

-- Add comments for documentation
COMMENT ON TABLE webinsight_analyses IS 'WebInsight Analyzer - Website analysis records';
COMMENT ON COLUMN webinsight_analyses.user_id IS 'User who created the analysis (NULL for anonymous)';
COMMENT ON COLUMN webinsight_analyses.normalized_url IS 'Canonical URL without protocol/www';
COMMENT ON COLUMN webinsight_analyses.seo_data IS 'SEO metrics: title, meta, headings, score';
COMMENT ON COLUMN webinsight_analyses.technical_data IS 'Technical metrics: performance, security, mobile';
COMMENT ON COLUMN webinsight_analyses.traffic_data IS 'Traffic estimates and sources';
COMMENT ON COLUMN webinsight_analyses.business_analysis IS 'AI-powered business model analysis';
```

### Step 2: Enable Row Level Security (RLS)

```sql
-- Enable RLS on the table
ALTER TABLE webinsight_analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own analyses
CREATE POLICY "Users can view own analyses"
  ON webinsight_analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON webinsight_analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own analyses
CREATE POLICY "Users can update own analyses"
  ON webinsight_analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
  ON webinsight_analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Allow anonymous analyses to be viewable by anyone with the ID
CREATE POLICY "Anonymous analyses readable by ID"
  ON webinsight_analyses
  FOR SELECT
  USING (user_id IS NULL);
```

## 📦 Storage Setup

### Step 3: Create Storage Bucket

1. Navigate to **Storage** in Supabase Studio
2. Click **New Bucket**
3. Configure:
   - **Name**: `webinsight_reports`
   - **Public bucket**: ❌ No (use signed URLs)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `application/pdf`

### Step 4: Set Storage Policies

Run this SQL to configure storage policies:

```sql
-- Policy: Users can upload PDFs to their own folder
CREATE POLICY "Users can upload own reports"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'webinsight_reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can read their own PDFs
CREATE POLICY "Users can download own reports"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'webinsight_reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own PDFs
CREATE POLICY "Users can delete own reports"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'webinsight_reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Anonymous PDFs readable via signed URL
CREATE POLICY "Anonymous reports readable via signed URL"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'webinsight_reports' AND
    (storage.foldername(name))[1] = 'anonymous'
  );
```

## 🔧 Environment Variables

After setting up the database, configure these environment variables in your application:

```bash
# Supabase Connection (already configured in VPS)
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.smartcamp.ai
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUxNzk0MzAwLCJleHAiOjIwNjcxNTQzMDB9.OuEL1wHusMc323PhIe_pjbme3DSstlWn5DB0m9uorTc

# Service Role Key (Server-side only - NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTE3OTQzMDAsImV4cCI6MjA2NzE1NDMwMH0.YInoydQJtOb2cst7sAjLcHbWcx6evVf3Gy-j5x5ZgsE

# JWT Secret (for verification)
SUPABASE_JWT_SECRET=Vi43sxW5rB2Eq9jDDfNBMgaVYmlMkOmJeTq7F6gilJg=
```

## ✅ Verification Checklist

After completing the setup, verify everything is working:

### Database Verification

```sql
-- Check table exists
SELECT * FROM webinsight_analyses LIMIT 1;

-- Verify indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'webinsight_analyses';

-- Check RLS policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'webinsight_analyses';
```

### Storage Verification

1. Navigate to **Storage > webinsight_reports** in Supabase Studio
2. Verify bucket exists and is private
3. Check policies are active

### Application Integration Test

```bash
# Test database connection
npm run dev

# Navigate to http://localhost:3000
# Sign up for an account
# Run an analysis
# Verify data appears in Supabase Studio
```

## 🔐 Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **RLS is critical** - Always verify RLS policies are active
3. **Service role key** - Only use server-side, never expose to client
4. **Signed URLs** - Use for temporary PDF access (1 hour expiry)
5. **User isolation** - Each user can only access their own data

## 🆘 Troubleshooting

### "Permission denied for table webinsight_analyses"
- Verify RLS policies are correctly configured
- Check user is authenticated when querying
- Ensure service role key is used for admin operations

### "Bucket webinsight_reports does not exist"
- Create bucket in Supabase Studio
- Verify bucket name matches exactly
- Check storage policies are applied

### "Failed to upload PDF"
- Verify user has storage upload policy
- Check file size is under 10MB
- Ensure MIME type is `application/pdf`

### "Cannot read analyses from other users"
- This is correct behavior (RLS working)
- Each user should only see their own analyses
- Use service role key for admin queries

## 📞 Support

For issues or questions:
- Check VPS logs: `docker logs supabase-db`
- Review Supabase Studio logs
- Contact: hello@smartcamp.ai

---

**Database Schema Version:** 1.0
**Last Updated:** November 17, 2025
**Status:** Production Ready
