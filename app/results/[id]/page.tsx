/**
 * Analysis Results Page
 * Displays comprehensive website analysis results
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Home, TrendingUp, Zap, Shield, BarChart } from 'lucide-react'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import type { Analysis } from '@/types'

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseAdmin()

  const { data: analysis, error } = await supabase
    .from('webinsight_analyses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !analysis) {
    notFound()
  }

  const typedAnalysis = analysis as Analysis

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analysis Results</h1>
            <p className="text-white/70">
              {typedAnalysis.url} •{' '}
              {new Date(typedAnalysis.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            {typedAnalysis.pdf_url && (
              <Button variant="emerald" asChild>
                <a href={typedAnalysis.pdf_url} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                New Analysis
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>SEO Score</CardDescription>
              <CardTitle className="text-3xl">
                {typedAnalysis.seo_data?.seo_score || 0}/100
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrendingUp
                className={`h-8 w-8 ${
                  (typedAnalysis.seo_data?.seo_score || 0) >= 80
                    ? 'text-emerald-400'
                    : 'text-yellow-400'
                }`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Performance</CardDescription>
              <CardTitle className="text-3xl">
                {typedAnalysis.technical_data?.performance_score || 0}/100
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Zap
                className={`h-8 w-8 ${
                  (typedAnalysis.technical_data?.performance_score || 0) >= 80
                    ? 'text-emerald-400'
                    : 'text-yellow-400'
                }`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Est. Monthly Visitors</CardDescription>
              <CardTitle className="text-3xl">
                {formatNumber(typedAnalysis.traffic_data?.estimated_monthly_visitors || 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart className="h-8 w-8 text-emerald-400" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Security</CardDescription>
              <CardTitle className="text-xl">
                {typedAnalysis.technical_data?.https_enabled ? 'Secure' : 'Insecure'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Shield
                className={`h-8 w-8 ${
                  typedAnalysis.technical_data?.https_enabled
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              />
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary */}
        {typedAnalysis.business_analysis?.executive_summary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 leading-relaxed">
                {typedAnalysis.business_analysis.executive_summary}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detailed Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEO Analysis */}
          {typedAnalysis.seo_data && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Analysis</CardTitle>
                <CardDescription>On-page SEO factors and optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-white/70 mb-1">Title</p>
                  <p className="text-white">{typedAnalysis.seo_data.title || 'No title found'}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-1">Meta Description</p>
                  <p className="text-white text-sm">
                    {typedAnalysis.seo_data.meta_description || 'No meta description'}
                  </p>
                </div>
                {typedAnalysis.seo_data.issues && typedAnalysis.seo_data.issues.length > 0 && (
                  <div>
                    <p className="text-sm text-white/70 mb-2">Issues</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {typedAnalysis.seo_data.issues.map((issue, idx) => (
                        <li key={idx} className="text-yellow-400">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Technical Analysis */}
          {typedAnalysis.technical_data && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Analysis</CardTitle>
                <CardDescription>Performance and security metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">HTTPS Enabled</span>
                  <span
                    className={
                      typedAnalysis.technical_data.https_enabled
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }
                  >
                    {typedAnalysis.technical_data.https_enabled ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Mobile Friendly</span>
                  <span
                    className={
                      typedAnalysis.technical_data.mobile_friendly
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }
                  >
                    {typedAnalysis.technical_data.mobile_friendly ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Page Load Time</span>
                  <span className="text-white">
                    {typedAnalysis.technical_data.page_load_time.toFixed(2)}s
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Analysis */}
          {typedAnalysis.business_analysis && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Business Model & Recommendations</CardTitle>
                <CardDescription>
                  AI-powered business analysis and improvement suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-white/70 mb-1">Business Model</p>
                  <p className="text-xl font-semibold text-emerald-400">
                    {typedAnalysis.business_analysis.business_model}
                  </p>
                </div>

                {typedAnalysis.business_analysis.recommendations &&
                  typedAnalysis.business_analysis.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm text-white/70 mb-3">Top Recommendations</p>
                      <div className="space-y-3">
                        {typedAnalysis.business_analysis.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="border-l-4 border-emerald-400 pl-4 py-2 bg-white/5 rounded-r"
                          >
                            <p className="font-semibold text-white mb-1">{rec.title}</p>
                            <p className="text-sm text-white/70 mb-2">{rec.description}</p>
                            <div className="flex gap-3 text-xs text-white/60">
                              <span className="capitalize">Priority: {rec.priority}</span>
                              <span>•</span>
                              <span className="capitalize">Category: {rec.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
