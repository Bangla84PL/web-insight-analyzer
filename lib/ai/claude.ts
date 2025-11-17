/**
 * Claude API Integration
 * Primary AI service for business model analysis
 */

import Anthropic from '@anthropic-ai/sdk'
import type { BusinessAnalysis } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

/**
 * Analyze website content and determine business model
 * Returns structured business analysis
 */
export async function analyzeBusinessModel(
  url: string,
  htmlContent: string,
  seoData: any
): Promise<BusinessAnalysis> {
  try {
    const prompt = createAnalysisPrompt(url, htmlContent, seoData)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract text content from response
    const textContent = message.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('\n')

    // Parse JSON response
    const analysis = parseAnalysisResponse(textContent)

    return analysis
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error('Failed to analyze website with Claude API')
  }
}

/**
 * Create analysis prompt for Claude
 */
function createAnalysisPrompt(url: string, htmlContent: string, seoData: any): string {
  // Truncate HTML content to avoid token limits
  const truncatedContent = htmlContent.substring(0, 8000)

  return `You are a business analyst expert. Analyze this website and provide a comprehensive business assessment.

Website URL: ${url}
Title: ${seoData?.title || 'Unknown'}
Description: ${seoData?.meta_description || 'No description'}

Website Content (truncated):
${truncatedContent}

Provide your analysis in the following JSON format:
{
  "business_model": "SaaS" | "ecommerce" | "content" | "lead-gen" | "marketplace" | "other",
  "business_model_confidence": 0.0-1.0,
  "target_audience": "description of the target audience",
  "value_proposition": "main value proposition",
  "competitive_advantages": ["advantage1", "advantage2", "advantage3"],
  "weaknesses": ["weakness1", "weakness2"],
  "monetization_signals": ["signal1", "signal2"],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description",
      "priority": "high" | "medium" | "low",
      "category": "seo" | "technical" | "content" | "conversion" | "marketing",
      "estimated_impact": "Expected impact description"
    }
  ],
  "executive_summary": "2-3 sentence summary of the business and its potential",
  "market_positioning": "How the business positions itself in the market"
}

Focus on actionable insights. Be specific and data-driven where possible.`
}

/**
 * Parse Claude's JSON response
 */
function parseAnalysisResponse(response: string): BusinessAnalysis {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate and structure the response
    return {
      business_model: parsed.business_model || 'other',
      business_model_confidence: parsed.business_model_confidence || 0.5,
      target_audience: parsed.target_audience || 'General audience',
      value_proposition: parsed.value_proposition || 'No clear value proposition identified',
      competitive_advantages: Array.isArray(parsed.competitive_advantages)
        ? parsed.competitive_advantages
        : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      monetization_signals: Array.isArray(parsed.monetization_signals)
        ? parsed.monetization_signals
        : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      executive_summary: parsed.executive_summary || 'Analysis unavailable',
      market_positioning: parsed.market_positioning,
    }
  } catch (error) {
    console.error('Failed to parse Claude response:', error)
    // Return fallback analysis
    return {
      business_model: 'other',
      business_model_confidence: 0.3,
      target_audience: 'Unable to determine',
      value_proposition: 'Unable to determine',
      competitive_advantages: [],
      weaknesses: ['Insufficient data for analysis'],
      monetization_signals: [],
      recommendations: [
        {
          title: 'Improve website clarity',
          description: 'Make your value proposition and business model more clear to visitors and search engines.',
          priority: 'high',
          category: 'content',
          estimated_impact: 'Better user engagement and SEO performance',
        },
      ],
      executive_summary: 'Unable to fully analyze the business model. More prominent information needed.',
    }
  }
}
