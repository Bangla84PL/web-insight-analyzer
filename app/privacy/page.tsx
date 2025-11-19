/**
 * Privacy Policy Page
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | WebInsight Analyzer',
  description: 'Privacy policy for WebInsight Analyzer by SmartCamp.AI',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <section className="space-y-6 text-white/80">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
                <p>
                  Welcome to WebInsight Analyzer ("we," "our," or "us"). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website analysis service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-white mb-2">Account Information</h3>
                <p>When you register for an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                  <li>Account creation date</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Analysis Data</h3>
                <p>When you use our service, we collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>URLs of websites you analyze</li>
                  <li>Analysis results and reports</li>
                  <li>Timestamp of analyses</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Usage Information</h3>
                <p>We automatically collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address (for rate limiting)</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Pages visited and features used</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide and maintain our service</li>
                  <li>Process your website analysis requests</li>
                  <li>Generate and deliver PDF reports</li>
                  <li>Prevent abuse through rate limiting</li>
                  <li>Improve our service and user experience</li>
                  <li>Communicate with you about your account</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">4. Data Storage and Security</h2>
                <p>
                  Your data is stored securely using industry-standard encryption and security practices. We use Supabase for authentication and data storage, with row-level security policies to ensure your data is only accessible to you.
                </p>
                <p className="mt-2">
                  Generated reports are stored in encrypted cloud storage with signed URLs that expire after use.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">5. Data Sharing and Disclosure</h2>
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights, privacy, safety, or property</li>
                  <li>With service providers who assist in operating our service (under strict confidentiality agreements)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">6. Third-Party Services</h2>
                <p>We use the following third-party services:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Anthropic Claude API:</strong> For AI-powered business analysis</li>
                  <li><strong>Google PageSpeed Insights:</strong> For SEO and performance metrics</li>
                  <li><strong>Supabase:</strong> For authentication and data storage</li>
                </ul>
                <p className="mt-2">
                  These services have their own privacy policies, and we recommend reviewing them.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Withdraw consent at any time</li>
                  <li>Object to data processing</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:hello@smartcamp.ai" className="text-emerald-400 hover:underline">
                    hello@smartcamp.ai
                  </a>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">8. Cookies and Tracking</h2>
                <p>
                  We use essential cookies for authentication and session management. We do not use advertising or tracking cookies. You can control cookies through your browser settings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">9. Data Retention</h2>
                <p>
                  We retain your account information and analysis data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where required to retain it for legal purposes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">10. Children's Privacy</h2>
                <p>
                  Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice on our website. Your continued use of the service after changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">12. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none space-y-1 mt-2">
                  <li>Email: <a href="mailto:hello@smartcamp.ai" className="text-emerald-400 hover:underline">hello@smartcamp.ai</a></li>
                  <li>Website: <a href="https://smartcamp.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">smartcamp.ai</a></li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-white/60">
                  This privacy policy is provided by SmartCamp.AI for WebInsight Analyzer. By using our service, you acknowledge that you have read and understood this Privacy Policy.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
