/**
 * Terms of Service Page
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | WebInsight Analyzer',
  description: 'Terms of service for WebInsight Analyzer by SmartCamp.AI',
}

export default function TermsPage() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <section className="space-y-6 text-white/80">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using WebInsight Analyzer ("the Service"), operated by SmartCamp.AI, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
                <p>
                  WebInsight Analyzer is a website analysis tool that provides:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>SEO analysis and metrics</li>
                  <li>Technical performance evaluation</li>
                  <li>Traffic estimates and insights</li>
                  <li>AI-powered business model analysis</li>
                  <li>Downloadable PDF reports</li>
                </ul>
                <p className="mt-2">
                  The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">3. User Accounts</h2>
                <h3 className="text-xl font-semibold text-white mb-2">Registration</h3>
                <p>
                  To access certain features, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activities.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">4. Usage Limits and Fair Use</h2>
                <h3 className="text-xl font-semibold text-white mb-2">Rate Limits</h3>
                <p>Anonymous users are subject to the following limits:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>3 analyses per hour</li>
                  <li>10 analyses per day</li>
                </ul>
                <p className="mt-2">Registered users may have different limits based on their account tier.</p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Prohibited Activities</h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Abuse or circumvent rate limits</li>
                  <li>Use automated tools to scrape or overload the Service</li>
                  <li>Analyze websites you do not have permission to analyze</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Use the Service for illegal purposes</li>
                  <li>Resell or redistribute the Service without permission</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">5. Intellectual Property</h2>
                <h3 className="text-xl font-semibold text-white mb-2">Our Content</h3>
                <p>
                  The Service, including all content, features, and functionality, is owned by SmartCamp.AI and protected by international copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Your Content</h3>
                <p>
                  You retain ownership of any URLs you submit for analysis. By using the Service, you grant us a limited license to process and analyze these URLs to provide the Service to you.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Reports</h3>
                <p>
                  Generated reports are your property. However, they must retain the SmartCamp.AI attribution footer as required by our branding guidelines.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">6. Data and Privacy</h2>
                <p>
                  Your use of the Service is also governed by our{' '}
                  <Link href="/privacy" className="text-emerald-400 hover:underline">
                    Privacy Policy
                  </Link>
                  . We collect and process data as described in the Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">7. Third-Party Services</h2>
                <p>
                  The Service integrates with third-party APIs and services (e.g., Google PageSpeed Insights, Anthropic Claude API). We are not responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The accuracy or reliability of third-party data</li>
                  <li>Third-party service availability or downtime</li>
                  <li>Third-party terms of service or privacy policies</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">8. Disclaimers and Limitations</h2>
                <h3 className="text-xl font-semibold text-white mb-2">No Warranty</h3>
                <p>
                  The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Accuracy of Information</h3>
                <p>
                  While we strive to provide accurate analysis, we do not guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The accuracy or completeness of analysis results</li>
                  <li>The reliability of traffic estimates</li>
                  <li>The correctness of AI-generated insights</li>
                </ul>
                <p className="mt-2">
                  All reports should be used as informational tools and verified independently.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, SmartCamp.AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your use or inability to use the Service</li>
                  <li>Any unauthorized access to your account or data</li>
                  <li>Any errors, mistakes, or inaccuracies in analysis results</li>
                  <li>Service interruptions or downtime</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless SmartCamp.AI and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Your analysis of websites without proper authorization</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">10. Modifications to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes by email or through a notice on the Service. Your continued use after changes constitutes acceptance of the modified Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">11. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SmartCamp.AI operates, without regard to its conflict of law provisions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">12. Dispute Resolution</h2>
                <p>
                  Any disputes arising from these Terms or your use of the Service shall first be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the applicable arbitration association.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">13. Severability</h2>
                <p>
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining Terms remain in full force and effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">14. Entire Agreement</h2>
                <p>
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and SmartCamp.AI regarding the Service and supersede all prior agreements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">15. Contact Information</h2>
                <p>
                  If you have questions about these Terms, please contact us:
                </p>
                <ul className="list-none space-y-1 mt-2">
                  <li>Email: <a href="mailto:hello@smartcamp.ai" className="text-emerald-400 hover:underline">hello@smartcamp.ai</a></li>
                  <li>Website: <a href="https://smartcamp.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">smartcamp.ai</a></li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-white/60">
                  By using WebInsight Analyzer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
