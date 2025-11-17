/**
 * Website Analysis API Route
 * POST /api/analyze
 *
 * Orchestrates complete website analysis:
 * 1. Rate limiting check
 * 2. URL validation and normalization
 * 3. Parallel data gathering (PageSpeed, content scraping)
 * 4. AI business analysis (Claude)
 * 5. Store results in Supabase
 * 6. Generate PDF report
 * 7. Return analysis ID and PDF URL
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/redis/rateLimit'
import { analyzeWithPageSpeed } from '@/lib/analyzers/pagespeed'
import { fetchWebsiteContent } from '@/lib/analyzers/scraper'
import { analyzeBusinessModel } from '@/lib/ai/claude'
import { generatePDF } from '@/lib/pdf/generator'
import { normalizeUrl, isValidUrl, addProtocol } from '@/lib/utils'
import type { Analysis, AnalysisRequest, AnalysisResponse } from '@/types'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse request body
    const body: AnalysisRequest = await request.json()
    const { url } = body

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      )
    }

    // Normalize and add protocol
    const fullUrl = addProtocol(url)
    const normalizedUrl = normalizeUrl(fullUrl)

    // Get user ID if authenticated
    const supabase = createSupabaseAdmin()
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const {
        data: { user },
      } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    // Check rate limiting for anonymous users
    const clientIp = getClientIp(request)
    const rateLimitResult = await checkRateLimit(clientIp, userId || undefined)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: rateLimitResult.message,
          reset_time: rateLimitResult.resetTime,
        },
        { status: 429 }
      )
    }

    // Create analysis record (pending status)
    const { data: analysisRecord, error: insertError } = await supabase
      .from('webinsight_analyses')
      .insert({
        user_id: userId,
        url: fullUrl,
        normalized_url: normalizedUrl,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError || !analysisRecord) {
      console.error('Failed to create analysis record:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create analysis record' },
        { status: 500 }
      )
    }

    try {
      // Parallel data gathering
      const [pageSpeedResult, websiteContent] = await Promise.allSettled([
        analyzeWithPageSpeed(fullUrl),
        fetchWebsiteContent(fullUrl),
      ])

      // Extract results
      const seoData =
        pageSpeedResult.status === 'fulfilled' ? pageSpeedResult.value.seoData : null
      const technicalData =
        pageSpeedResult.status === 'fulfilled' ? pageSpeedResult.value.technicalData : null

      const htmlContent =
        websiteContent.status === 'fulfilled' ? websiteContent.value.html : ''

      // AI Business Analysis
      let businessAnalysis = null
      try {
        businessAnalysis = await analyzeBusinessModel(fullUrl, htmlContent, seoData)
      } catch (aiError) {
        console.error('AI analysis failed:', aiError)
        // Continue without business analysis
      }

      // Mock traffic data (would integrate real API in production)
      const trafficData = {
        estimated_monthly_visitors: Math.floor(Math.random() * 100000) + 1000,
        confidence_level: 'medium' as const,
        top_countries: ['US', 'UK', 'CA'],
        traffic_sources: {
          direct: 40,
          search: 35,
          referral: 15,
          social: 10,
        },
      }

      // Update analysis record with data
      const updatedAnalysis: Partial<Analysis> = {
        status: 'completed',
        seo_data: seoData,
        technical_data: technicalData,
        traffic_data: trafficData,
        business_analysis: businessAnalysis,
        processing_time: Date.now() - startTime,
        api_calls_made: {
          pagespeed_api: pageSpeedResult.status === 'fulfilled',
          claude_api: businessAnalysis !== null,
          total_api_time: Date.now() - startTime,
        },
      }

      const { data: completedAnalysis, error: updateError } = await supabase
        .from('webinsight_analyses')
        .update(updatedAnalysis)
        .eq('id', analysisRecord.id)
        .select()
        .single()

      if (updateError) {
        console.error('Failed to update analysis:', updateError)
        throw new Error('Failed to update analysis')
      }

      // Generate PDF
      let pdfUrl: string | null = null
      try {
        const pdfBuffer = await generatePDF(completedAnalysis as Analysis)

        // Upload to Supabase Storage
        const fileName = `${userId || 'anonymous'}/${analysisRecord.id}.pdf`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('webinsight_reports')
          .upload(fileName, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          })

        if (!uploadError && uploadData) {
          // Get signed URL (valid for 1 hour)
          const { data: signedUrlData } = await supabase.storage
            .from('webinsight_reports')
            .createSignedUrl(fileName, 3600)

          if (signedUrlData) {
            pdfUrl = signedUrlData.signedUrl

            // Update analysis with PDF URL
            await supabase
              .from('webinsight_analyses')
              .update({
                pdf_url: pdfUrl,
                pdf_size: pdfBuffer.length,
              })
              .eq('id', analysisRecord.id)
          }
        }
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError)
        // Continue without PDF
      }

      // Return success response
      const response: AnalysisResponse = {
        success: true,
        analysis_id: analysisRecord.id,
        analysis: completedAnalysis as Analysis,
        pdf_url: pdfUrl || undefined,
        message: 'Analysis completed successfully',
      }

      return NextResponse.json(response, { status: 200 })
    } catch (analysisError) {
      // Update analysis record with error
      await supabase
        .from('webinsight_analyses')
        .update({
          status: 'error',
          error_message:
            analysisError instanceof Error
              ? analysisError.message
              : 'Unknown error occurred',
        })
        .eq('id', analysisRecord.id)

      throw analysisError
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve existing analysis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get('id')

    if (!analysisId) {
      return NextResponse.json({ success: false, error: 'Missing analysis ID' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()
    const { data: analysis, error } = await supabase
      .from('webinsight_analyses')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (error || !analysis) {
      return NextResponse.json({ success: false, error: 'Analysis not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch analysis' }, { status: 500 })
  }
}
