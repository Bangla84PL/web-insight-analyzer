/**
 * Landing Page - WebInsight Analyzer
 * Main entry point for website analysis
 */

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Zap, FileText, Shield, TrendingUp, Users } from 'lucide-react'
import AnalyzeForm from '@/components/analyze-form'
import { getServerUser } from '@/lib/supabase/server'

export default async function HomePage() {
  const user = await getServerUser()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="border-b border-white/20 sticky top-0 z-50"
        style={{
          backgroundImage: "url('/backgrounds/jungle background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="jungle-overlay">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 hover-scale">
                <Image
                  src="/logos/SmartCampAIpng.png"
                  alt="SmartCamp AI"
                  width={160}
                  height={80}
                  className="h-12 w-auto sm:h-14 md:h-16"
                  priority
                />
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                    <Link href="/auth/logout">
                      <Button variant="outline">Logout</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button variant="emerald">Sign Up Free</Button>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 flex-1">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center fade-in">
            {/* Welcome Message for Authenticated Users */}
            {user && (
              <p className="text-emerald-400 font-semibold text-lg mb-4">
                Welcome back, {user.email?.split('@')[0]}!
              </p>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow">
              Analyze Any Website's Business Potential in{' '}
              <span className="text-emerald-400">Seconds</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get SEO, technical, traffic, and AI-powered business insights in one comprehensive
              report
            </p>

            {/* Analysis Form */}
            <div className="mb-8">
              <AnalyzeForm isAuthenticated={!!user} />
            </div>

            {/* Rate Limit Info */}
            {!user && (
              <p className="text-white/60 text-sm">
                <Shield className="inline w-4 h-4 mr-1" />3 free analyses per hour • 10 per day •{' '}
                <Link href="/auth/signup" className="text-emerald-400 hover:underline">
                  Sign up
                </Link>{' '}
                for unlimited
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-black/20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose WebInsight Analyzer?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-lift">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-emerald-400 mb-4" />
                <CardTitle>Comprehensive Analysis</CardTitle>
                <CardDescription>
                  SEO metrics, technical performance, traffic estimates, and business intelligence
                  - all in one place
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <Zap className="w-12 h-12 text-emerald-400 mb-4" />
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Claude AI analyzes your website's business model and provides actionable
                  recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <FileText className="w-12 h-12 text-emerald-400 mb-4" />
                <CardTitle>Professional PDF Reports</CardTitle>
                <CardDescription>
                  Downloadable, shareable reports perfect for presentations and client deliverables
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Enter Website URL</h3>
                  <p className="text-white/70">
                    Simply paste any website URL you want to analyze - no signup required for your
                    first analyses
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Analysis in Progress</h3>
                  <p className="text-white/70">
                    Our system analyzes SEO, performance, traffic, and business model using
                    advanced AI
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Download Professional Report
                  </h3>
                  <p className="text-white/70">
                    Get a comprehensive PDF report with actionable insights and recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-gradient-to-r from-emerald-600/20 to-emerald-400/20">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Unlock Your Website's Potential?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Sign up for free to save your analyses and get unlimited reports
            </p>
            <Link href="/auth/signup">
              <Button variant="emerald" size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
                <CardTitle className="text-lg">SEO Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm">
                  Detailed SEO analysis including meta tags, headings, and technical SEO factors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-emerald-400 mb-2" />
                <CardTitle className="text-lg">Security Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm">
                  HTTPS status, security headers, and SSL certificate validation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-emerald-400 mb-2" />
                <CardTitle className="text-lg">Traffic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm">
                  Estimated visitor data, traffic sources, and audience demographics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
