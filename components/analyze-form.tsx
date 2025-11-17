'use client'

/**
 * Website Analysis Form Component
 * Main form for submitting URLs for analysis
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Search } from 'lucide-react'
import { isValidUrl } from '@/lib/utils'

interface AnalyzeFormProps {
  isAuthenticated: boolean
}

export default function AnalyzeForm({ isAuthenticated }: AnalyzeFormProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate URL
    if (!url.trim()) {
      toast({
        title: 'URL Required',
        description: 'Please enter a website URL to analyze',
        variant: 'destructive',
      })
      return
    }

    if (!isValidUrl(url)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid website URL (e.g., example.com)',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Call analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          toast({
            title: 'Rate Limit Exceeded',
            description: data.message || 'Please try again later or sign up for unlimited access',
            variant: 'destructive',
          })
          return
        }

        throw new Error(data.error || 'Analysis failed')
      }

      // Success - redirect to results page
      toast({
        title: 'Analysis Complete!',
        description: 'Your website analysis is ready',
      })

      router.push(`/results/${data.analysis_id}`)
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="h-12 text-base"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="h-12 px-8"
            variant="emerald"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Analyze Now
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-center">
            <p className="text-white/80 text-sm mb-2">
              🔍 Analyzing website... This usually takes 30-45 seconds
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-white/60">
              <span>⚡ Fetching SEO data</span>
              <span>•</span>
              <span>📊 Running performance tests</span>
              <span>•</span>
              <span>🤖 AI business analysis</span>
            </div>
          </div>
        )}

        {/* Info for Authenticated Users */}
        {isAuthenticated && (
          <p className="text-center text-white/60 text-sm">
            ✨ Your analysis will be automatically saved to your dashboard
          </p>
        )}
      </form>
    </Card>
  )
}
