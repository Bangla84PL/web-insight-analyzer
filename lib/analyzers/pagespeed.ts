/**
 * Google PageSpeed Insights API Integration
 * Fetches SEO and technical performance data
 */

import type { SEOData, TechnicalData } from '@/types'

const PAGESPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

/**
 * Analyze website using Google PageSpeed Insights API
 */
export async function analyzeWithPageSpeed(url: string): Promise<{
  seoData: SEOData
  technicalData: TechnicalData
}> {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || ''
    const apiUrl = new URL(PAGESPEED_API_URL)

    apiUrl.searchParams.append('url', url)
    apiUrl.searchParams.append('category', 'PERFORMANCE')
    apiUrl.searchParams.append('category', 'SEO')
    apiUrl.searchParams.append('category', 'BEST_PRACTICES')
    apiUrl.searchParams.append('strategy', 'MOBILE')

    if (apiKey) {
      apiUrl.searchParams.append('key', apiKey)
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'User-Agent': 'WebInsight Analyzer',
      },
    })

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract SEO and technical data
    const seoData = extractSEOData(data)
    const technicalData = extractTechnicalData(data)

    return { seoData, technicalData }
  } catch (error) {
    console.error('PageSpeed Insights error:', error)
    // Return minimal fallback data
    return {
      seoData: createFallbackSEOData(),
      technicalData: createFallbackTechnicalData(),
    }
  }
}

/**
 * Extract SEO data from PageSpeed response
 */
function extractSEOData(data: any): SEOData {
  const audits = data.lighthouseResult?.audits || {}
  const finalUrl = data.lighthouseResult?.finalUrl || data.id

  return {
    title: audits['document-title']?.details?.items?.[0]?.value || 'No title',
    meta_description: audits['meta-description']?.details?.items?.[0]?.value,
    h1_tags: extractHeadings(audits),
    canonical_url: finalUrl,
    robots_txt_exists: audits['robots-txt']?.score === 1,
    sitemap_exists: true, // Would need separate check
    seo_score: Math.round((data.lighthouseResult?.categories?.seo?.score || 0) * 100),
    issues: extractSEOIssues(audits),
    recommendations: extractSEORecommendations(audits),
    structured_data: audits['structured-data']?.score === 1,
    alt_text_coverage: audits['image-alt']?.score || 0,
  }
}

/**
 * Extract technical data from PageSpeed response
 */
function extractTechnicalData(data: any): TechnicalData {
  const audits = data.lighthouseResult?.audits || {}
  const finalUrl = data.lighthouseResult?.finalUrl || data.id

  return {
    performance_score: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
    https_enabled: finalUrl.startsWith('https://'),
    mobile_friendly: audits['viewport']?.score === 1,
    page_load_time: parseFloat(audits['interactive']?.displayValue || '0') || 0,
    first_contentful_paint: parseFloat(audits['first-contentful-paint']?.numericValue || 0) / 1000,
    time_to_interactive: parseFloat(audits['interactive']?.numericValue || 0) / 1000,
    cumulative_layout_shift: parseFloat(audits['cumulative-layout-shift']?.displayValue || '0'),
    security_headers: {
      content_security_policy: false, // Would need separate check
      x_frame_options: false,
      strict_transport_security: finalUrl.startsWith('https://'),
      x_content_type_options: false,
    },
    server_info: {
      response_time: parseFloat(audits['server-response-time']?.numericValue || 0) / 1000,
    },
    issues: extractTechnicalIssues(audits),
    recommendations: extractTechnicalRecommendations(audits),
  }
}

/**
 * Extract heading tags
 */
function extractHeadings(audits: any): string[] {
  const headingAudit = audits['heading-order']
  if (!headingAudit?.details?.items) return []

  return headingAudit.details.items
    .filter((item: any) => item.node?.snippet)
    .map((item: any) => item.node.snippet.replace(/<[^>]*>/g, ''))
    .slice(0, 5)
}

/**
 * Extract SEO issues
 */
function extractSEOIssues(audits: any): string[] {
  const issues: string[] = []

  if (audits['document-title']?.score !== 1) {
    issues.push('Missing or improper page title')
  }
  if (audits['meta-description']?.score !== 1) {
    issues.push('Missing or improper meta description')
  }
  if (audits['link-text']?.score !== 1) {
    issues.push('Links do not have descriptive text')
  }
  if (audits['image-alt']?.score !== 1) {
    issues.push('Images missing alt attributes')
  }
  if (audits['hreflang']?.score !== 1) {
    issues.push('hreflang tags need attention')
  }

  return issues
}

/**
 * Extract SEO recommendations
 */
function extractSEORecommendations(audits: any): string[] {
  const recommendations: string[] = []

  if (audits['document-title']?.score !== 1) {
    recommendations.push('Optimize page title with target keywords')
  }
  if (audits['meta-description']?.score !== 1) {
    recommendations.push('Add compelling meta description under 160 characters')
  }
  if (audits['link-text']?.score !== 1) {
    recommendations.push('Use descriptive anchor text for all links')
  }
  if (audits['crawlable-anchors']?.score !== 1) {
    recommendations.push('Ensure links are crawlable by search engines')
  }

  return recommendations
}

/**
 * Extract technical issues
 */
function extractTechnicalIssues(audits: any): string[] {
  const issues: string[] = []

  if (audits['viewport']?.score !== 1) {
    issues.push('Viewport not configured for mobile devices')
  }
  if (audits['uses-responsive-images']?.score !== 1) {
    issues.push('Images not properly sized for mobile')
  }
  if (audits['font-display']?.score !== 1) {
    issues.push('Webfonts not optimized for loading')
  }

  return issues
}

/**
 * Extract technical recommendations
 */
function extractTechnicalRecommendations(audits: any): string[] {
  const recommendations: string[] = []

  if (audits['uses-text-compression']?.score !== 1) {
    recommendations.push('Enable text compression (Gzip/Brotli)')
  }
  if (audits['unused-css-rules']?.score !== 1) {
    recommendations.push('Remove unused CSS')
  }
  if (audits['modern-image-formats']?.score !== 1) {
    recommendations.push('Serve images in modern formats (WebP, AVIF)')
  }
  if (audits['offscreen-images']?.score !== 1) {
    recommendations.push('Defer offscreen images')
  }

  return recommendations
}

/**
 * Fallback SEO data if API fails
 */
function createFallbackSEOData(): SEOData {
  return {
    h1_tags: [],
    robots_txt_exists: false,
    sitemap_exists: false,
    seo_score: 0,
    issues: ['Unable to fetch SEO data'],
    recommendations: ['Run manual SEO audit'],
  }
}

/**
 * Fallback technical data if API fails
 */
function createFallbackTechnicalData(): TechnicalData {
  return {
    performance_score: 0,
    https_enabled: false,
    mobile_friendly: false,
    page_load_time: 0,
    security_headers: {
      content_security_policy: false,
      x_frame_options: false,
      strict_transport_security: false,
      x_content_type_options: false,
    },
    issues: ['Unable to fetch technical data'],
    recommendations: ['Run manual performance audit'],
  }
}
