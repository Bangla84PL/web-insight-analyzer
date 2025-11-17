/**
 * User Dashboard
 * Displays user's analysis history
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Home, Trash2 } from 'lucide-react'
import { getServerUser } from '@/lib/supabase/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

export default async function DashboardPage() {
  const user = await getServerUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  const supabase = createSupabaseAdmin()
  const { data: analyses } = await supabase
    .from('webinsight_analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Analysis History</h1>
            <p className="text-white/70">View and manage your website analyses</p>
          </div>
          <Button variant="emerald" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              New Analysis
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Analyses</CardDescription>
              <CardTitle className="text-3xl">{analyses?.length || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">
                {
                  analyses?.filter(
                    (a) =>
                      new Date(a.created_at).getMonth() === new Date().getMonth() &&
                      new Date(a.created_at).getFullYear() === new Date().getFullYear()
                  ).length
                }
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Account Type</CardDescription>
              <CardTitle className="text-2xl">Free (Unlimited)</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Analyses List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Click to view full report</CardDescription>
          </CardHeader>
          <CardContent>
            {!analyses || analyses.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 mb-4">No analyses yet</p>
                <Button variant="emerald" asChild>
                  <Link href="/">Analyze Your First Website</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {analyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    href={`/results/${analysis.id}`}
                    className="block p-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{analysis.url}</p>
                        <p className="text-sm text-white/60">
                          {formatRelativeTime(analysis.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {analysis.status === 'completed' && (
                          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                            Completed
                          </span>
                        )}
                        {analysis.status === 'error' && (
                          <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                            Error
                          </span>
                        )}
                        <Button variant="ghost" size="sm">
                          View Report
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
