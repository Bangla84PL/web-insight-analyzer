/**
 * PDF Generation using Gotenberg
 * Converts HTML templates to professional PDF reports
 */

import type { Analysis } from '@/types'

/**
 * Generate PDF from analysis data using Gotenberg service
 * Returns the PDF as a Buffer
 */
export async function generatePDF(analysis: Analysis): Promise<Buffer> {
  try {
    const htmlContent = createPDFTemplate(analysis)

    // Prepare form data for Gotenberg
    const formData = new FormData()

    // Add HTML file
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
    formData.append('files', htmlBlob, 'index.html')

    // Gotenberg configuration
    const gotenbergUrl = process.env.GOTENBERG_URL || 'https://gotenberg.smartcamp.ai'
    const authHeader = Buffer.from(
      `${process.env.GOTENBERG_USERNAME}:${process.env.GOTENBERG_PASSWORD}`
    ).toString('base64')

    // Call Gotenberg API
    const response = await fetch(`${gotenbergUrl}/forms/chromium/convert/html`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gotenberg API error: ${response.statusText} - ${errorText}`)
    }

    // Get PDF buffer
    const pdfBuffer = await response.arrayBuffer()
    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF report')
  }
}

/**
 * Create HTML template for PDF
 */
function createPDFTemplate(analysis: Analysis): string {
  const {
    url,
    created_at,
    seo_data,
    technical_data,
    traffic_data,
    business_analysis,
  } = analysis

  const date = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebInsight Analysis Report - ${url}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A4;
      margin: 20mm;
      @bottom-center {
        content: "© Created with ❤️ by SmartCamp.AI | https://smartcamp.ai";
        font-size: 9pt;
        color: #666;
      }
    }

    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .header {
      text-align: center;
      padding: 30px 0;
      border-bottom: 3px solid #10b981;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 28pt;
      color: #1f4d2f;
      margin-bottom: 10px;
    }

    .header .url {
      font-size: 16pt;
      color: #10b981;
      margin-bottom: 5px;
    }

    .header .date {
      font-size: 11pt;
      color: #666;
    }

    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 18pt;
      color: #1f4d2f;
      border-bottom: 2px solid #10b981;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .metric-card {
      border: 1px solid #e0e0e0;
      padding: 15px;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .metric-label {
      font-size: 10pt;
      color: #666;
      margin-bottom: 5px;
    }

    .metric-value {
      font-size: 20pt;
      font-weight: bold;
      color: #1f4d2f;
    }

    .metric-value.good {
      color: #10b981;
    }

    .metric-value.warning {
      color: #f59e0b;
    }

    .metric-value.bad {
      color: #ef4444;
    }

    .list-item {
      padding: 10px;
      margin-bottom: 8px;
      background: #f9f9f9;
      border-left: 3px solid #10b981;
      border-radius: 4px;
    }

    .recommendation {
      padding: 15px;
      margin-bottom: 12px;
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      border-radius: 4px;
    }

    .recommendation-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1f4d2f;
      margin-bottom: 5px;
    }

    .recommendation-desc {
      font-size: 10pt;
      color: #555;
      margin-bottom: 5px;
    }

    .recommendation-meta {
      font-size: 9pt;
      color: #666;
    }

    .priority-high {
      border-left-color: #ef4444;
      background: #fef2f2;
    }

    .priority-medium {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }

    .priority-low {
      border-left-color: #10b981;
    }

    .executive-summary {
      padding: 20px;
      background: #f0fdf4;
      border-radius: 8px;
      border-left: 4px solid #10b981;
      margin-bottom: 20px;
      font-size: 11pt;
      line-height: 1.8;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 10pt;
    }

    .footer a {
      color: #10b981;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>WebInsight Analyzer Report</h1>
    <div class="url">${url}</div>
    <div class="date">Analysis Date: ${date}</div>
  </div>

  <!-- Executive Summary -->
  ${business_analysis?.executive_summary ? `
  <div class="section">
    <h2 class="section-title">Executive Summary</h2>
    <div class="executive-summary">
      ${business_analysis.executive_summary}
    </div>
  </div>
  ` : ''}

  <!-- Key Metrics -->
  <div class="section">
    <h2 class="section-title">Key Metrics</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">SEO Score</div>
        <div class="metric-value ${getScoreClass(seo_data?.seo_score)}">${seo_data?.seo_score || 0}/100</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Performance Score</div>
        <div class="metric-value ${getScoreClass(technical_data?.performance_score)}">${technical_data?.performance_score || 0}/100</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Monthly Visitors (Est.)</div>
        <div class="metric-value">${formatNumber(traffic_data?.estimated_monthly_visitors || 0)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Business Model</div>
        <div class="metric-value" style="font-size: 14pt;">${business_analysis?.business_model || 'Unknown'}</div>
      </div>
    </div>
  </div>

  <!-- SEO Analysis -->
  ${seo_data ? `
  <div class="section">
    <h2 class="section-title">SEO Analysis</h2>
    <p style="margin-bottom: 15px;"><strong>Title:</strong> ${seo_data.title || 'No title found'}</p>
    <p style="margin-bottom: 15px;"><strong>Meta Description:</strong> ${seo_data.meta_description || 'No meta description'}</p>
    ${seo_data.issues && seo_data.issues.length > 0 ? `
      <h3 style="margin-top: 20px; margin-bottom: 10px; font-size: 13pt;">Issues Found</h3>
      ${seo_data.issues.map((issue: string) => `<div class="list-item">${issue}</div>`).join('')}
    ` : ''}
  </div>
  ` : ''}

  <!-- Technical Analysis -->
  ${technical_data ? `
  <div class="section">
    <h2 class="section-title">Technical Analysis</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">HTTPS Enabled</div>
        <div class="metric-value ${technical_data.https_enabled ? 'good' : 'bad'}">${technical_data.https_enabled ? 'Yes' : 'No'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Mobile Friendly</div>
        <div class="metric-value ${technical_data.mobile_friendly ? 'good' : 'bad'}">${technical_data.mobile_friendly ? 'Yes' : 'No'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Page Load Time</div>
        <div class="metric-value">${technical_data.page_load_time?.toFixed(2) || 'N/A'}s</div>
      </div>
    </div>
  </div>
  ` : ''}

  <!-- Business Analysis & Recommendations -->
  ${business_analysis?.recommendations && business_analysis.recommendations.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Recommendations</h2>
    ${business_analysis.recommendations.map((rec: any) => `
      <div class="recommendation priority-${rec.priority}">
        <div class="recommendation-title">${rec.title}</div>
        <div class="recommendation-desc">${rec.description}</div>
        <div class="recommendation-meta">
          Priority: ${rec.priority.toUpperCase()} | Category: ${rec.category} | Impact: ${rec.estimated_impact}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="footer">
    <p>© ${new Date().getFullYear()} Created with ❤️ by <a href="https://smartcamp.ai" target="_blank">SmartCamp.AI</a></p>
    <p style="margin-top: 10px; font-size: 9pt;">AI | Automations | Web Dev</p>
  </div>
</body>
</html>
  `.trim()
}

function getScoreClass(score?: number): string {
  if (!score) return ''
  if (score >= 80) return 'good'
  if (score >= 50) return 'warning'
  return 'bad'
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
