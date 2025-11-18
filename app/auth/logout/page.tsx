'use client'

/**
 * Logout Page
 * Automatically signs out the user and redirects to home
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/supabase/auth'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut()

        toast({
          title: 'Logged out successfully',
          description: 'You have been signed out of your account',
        })

        // Redirect to home page
        router.push('/')
        router.refresh()
      } catch (error) {
        toast({
          title: 'Logout Error',
          description: error instanceof Error ? error.message : 'Failed to sign out',
          variant: 'destructive',
        })

        // Still redirect even if there's an error
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1000)
      }
    }

    handleLogout()
  }, [router, toast])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Signing Out</CardTitle>
          <CardDescription>Please wait while we sign you out...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </CardContent>
      </Card>
    </div>
  )
}
