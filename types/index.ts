/**
 * WebInsight Analyzer - Type Definitions
 * Comprehensive type system for website analysis data structures
 */

// =================================
// DATABASE TYPES
// =================================

/**
 * Analysis record from Supabase database
 * Table: webinsight_analyses
 */
export interface Analysis {
  id: string
  user_id: string | null
  url: string
  normalized_url: string
  created_at: string
  status: 'pending' | 'completed' | 'error'
  error_message?: string | null
  seo_data: SEOData | null
  technical_data: TechnicalData | null
  traffic_data: TrafficData | null
  business_analysis: BusinessAnalysis | null
  pdf_url?: string | null
  pdf_size?: number | null
  processing_time?: number | null
  api_calls_made?: ApiCallsMetadata | null
}

/**
 * User profile from Supabase Auth
 */
export interface UserProfile {
  id: string
  email: string
  created_at: string
}

// =================================
// ANALYSIS DATA TYPES
// =================================

/**
 * SEO Analysis Data
 */
export interface SEOData {
  title?: string
  meta_description?: string
  h1_tags: string[]
  h2_tags?: string[]
  canonical_url?: string
  robots_txt_exists: boolean
  sitemap_exists: boolean
  seo_score: number
  issues: string[]
  recommendations: string[]
  meta_keywords?: string[]
  open_graph?: {
    title?: string
    description?: string
    image?: string
    type?: string
  }
  structured_data?: boolean
  alt_text_coverage?: number
}

/**
 * Technical Analysis Data
 */
export interface TechnicalData {
  performance_score: number
  https_enabled: boolean
  mobile_friendly: boolean
  page_load_time: number
  first_contentful_paint?: number
  time_to_interactive?: number
  cumulative_layout_shift?: number
  security_headers: {
    content_security_policy: boolean
    x_frame_options: boolean
    strict_transport_security: boolean
    x_content_type_options: boolean
  }
  ssl_certificate?: {
    valid: boolean
    issuer?: string
    expiry_date?: string
  }
  server_info?: {
    server_type?: string
    response_time: number
  }
  issues: string[]
  recommendations: string[]
}

/**
 * Traffic Estimation Data
 */
export interface TrafficData {
  estimated_monthly_visitors: number
  confidence_level: 'low' | 'medium' | 'high'
  top_countries?: string[]
  traffic_sources?: {
    direct?: number
    search?: number
    referral?: number
    social?: number
  }
  top_keywords?: string[]
  bounce_rate_estimate?: number
  avg_session_duration?: number
}

/**
 * AI-Powered Business Analysis
 */
export interface BusinessAnalysis {
  business_model: 'SaaS' | 'ecommerce' | 'content' | 'lead-gen' | 'marketplace' | 'other'
  business_model_confidence: number
  target_audience: string
  value_proposition: string
  competitive_advantages: string[]
  weaknesses: string[]
  recommendations: Recommendation[]
  executive_summary: string
  market_positioning?: string
  monetization_signals: string[]
}

/**
 * Recommendation structure
 */
export interface Recommendation {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'seo' | 'technical' | 'content' | 'conversion' | 'marketing'
  estimated_impact: string
}

/**
 * API Calls Metadata
 */
export interface ApiCallsMetadata {
  pagespeed_api: boolean
  claude_api: boolean
  openai_api?: boolean
  total_api_time: number
}

// =================================
// API REQUEST/RESPONSE TYPES
// =================================

/**
 * Analysis Request Body
 */
export interface AnalysisRequest {
  url: string
}

/**
 * Analysis Response
 */
export interface AnalysisResponse {
  success: boolean
  analysis_id: string
  analysis?: Analysis
  pdf_url?: string
  error?: string
  message?: string
}

/**
 * Rate Limit Response
 */
export interface RateLimitResponse {
  allowed: boolean
  remaining: number
  reset_time?: number
  message?: string
}

// =================================
// FORM TYPES
// =================================

/**
 * URL Analysis Form
 */
export interface AnalysisFormData {
  url: string
}

/**
 * Auth Form Data
 */
export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ResetPasswordFormData {
  email: string
}

// =================================
// COMPONENT PROP TYPES
// =================================

/**
 * Analysis Card Props
 */
export interface AnalysisCardProps {
  analysis: Analysis
  onDelete?: (id: string) => void
  onViewReport?: (id: string) => void
}

/**
 * Metric Card Props
 */
export interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

/**
 * Loading State Props
 */
export interface LoadingStateProps {
  message?: string
  progress?: number
}

// =================================
// UTILITY TYPES
// =================================

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

/**
 * API Error Response
 */
export interface ApiError {
  error: string
  message: string
  status_code: number
  details?: any
}

// =================================
// EXTERNAL API TYPES
// =================================

/**
 * Google PageSpeed Insights Response (simplified)
 */
export interface PageSpeedInsightsResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number }
      accessibility: { score: number }
      'best-practices': { score: number }
      seo: { score: number }
    }
    audits: Record<string, any>
  }
}

/**
 * Claude API Message
 */
export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Claude API Response (simplified)
 */
export interface ClaudeResponse {
  content: Array<{
    type: string
    text: string
  }>
}

// =================================
// ENUMS
// =================================

export enum AnalysisStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export enum BusinessModelType {
  SAAS = 'SaaS',
  ECOMMERCE = 'ecommerce',
  CONTENT = 'content',
  LEAD_GEN = 'lead-gen',
  MARKETPLACE = 'marketplace',
  OTHER = 'other'
}

export enum RecommendationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum RecommendationCategory {
  SEO = 'seo',
  TECHNICAL = 'technical',
  CONTENT = 'content',
  CONVERSION = 'conversion',
  MARKETING = 'marketing'
}
