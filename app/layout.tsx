import type { Metadata } from "next"
import { Jost } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/footer"

// Load Jost font from Google Fonts
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "WebInsight Analyzer - Comprehensive Website Analysis | SmartCamp.AI",
  description: "Analyze any website's business potential in seconds. Get SEO, technical, traffic, and AI-powered business insights in one comprehensive report.",
  keywords: ["website analysis", "SEO analysis", "website audit", "business intelligence", "AI analysis", "SmartCamp.AI"],
  authors: [{ name: "SmartCamp.AI", url: "https://smartcamp.ai" }],
  creator: "SmartCamp.AI",
  publisher: "SmartCamp.AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: "WebInsight Analyzer",
    title: "WebInsight Analyzer - AI-Powered Website Analysis",
    description: "Comprehensive website analysis with SEO, technical checks, traffic estimates, and AI-powered business insights. Get professional reports in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebInsight Analyzer - Powered by SmartCamp.AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInsight Analyzer - AI-Powered Website Analysis",
    description: "Analyze any website's business potential with AI-powered insights.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicons/favicon.ico",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.variable} font-jost antialiased min-h-screen flex flex-col`}>
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Global Footer - appears on all pages */}
        <Footer />

        {/* Toast notifications */}
        <Toaster />
      </body>
    </html>
  )
}
