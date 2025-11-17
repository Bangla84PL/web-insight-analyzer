/**
 * Website Scraper
 * Fetches and extracts basic website content for analysis
 */

/**
 * Fetch website HTML content
 */
export async function fetchWebsiteContent(url: string): Promise<{
  html: string
  title: string
  description: string
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; WebInsight Analyzer/1.0; +https://webinsight.smartcamp.ai)',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Extract title and description
    const title = extractTitle(html)
    const description = extractDescription(html)

    return {
      html,
      title,
      description,
    }
  } catch (error) {
    console.error('Error fetching website content:', error)
    throw new Error(`Failed to fetch website: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return titleMatch ? titleMatch[1].trim() : 'No title found'
}

/**
 * Extract meta description from HTML
 */
function extractDescription(html: string): string {
  const descMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  )
  return descMatch ? descMatch[1].trim() : 'No description found'
}

/**
 * Extract Open Graph data
 */
export function extractOpenGraph(html: string): Record<string, string> {
  const ogData: Record<string, string> = {}

  const ogMatches = html.matchAll(
    /<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']+)["']/gi
  )

  for (const match of ogMatches) {
    ogData[match[1]] = match[2]
  }

  return ogData
}
