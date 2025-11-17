import Image from "next/image"
import Link from "next/link"

/**
 * Global Footer Component
 * Required on all pages per SmartCamp.AI branding guidelines
 * Displays "© Created with ❤️ by SmartCamp.AI" linking to https://smartcamp.ai
 */
export default function Footer() {
  return (
    <footer
      className="border-t border-white/20 mt-auto"
      style={{
        backgroundImage: "url('/backgrounds/jungle background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="jungle-overlay">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Monkey Mascot */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Image
                src="/logos/Monkey_SmartCampAI-no-background.png"
                alt="SmartCamp AI Monkey Mascot"
                width={128}
                height={128}
                className="opacity-90 hover:opacity-100 transition-opacity hover:scale-105 duration-300"
              />
            </div>

            {/* Center: Copyright & Attribution */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-white/70 text-sm">
                © {new Date().getFullYear()} Created with ❤️ by{' '}
                <Link
                  href="https://smartcamp.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  SmartCamp.AI
                </Link>
              </p>
              <p className="text-white/50 text-xs">
                AI | Automations | Web Dev
              </p>
            </div>

            {/* Right: n8n Certified Badge */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <Link
                href="https://n8n.io/creators/smart-camp-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src="/badges/n8n-certified-creator.png"
                  alt="n8n Certified Creator"
                  width={112}
                  height={112}
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-white/60">
              <Link href="/privacy" className="hover:text-white/90 transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/terms" className="hover:text-white/90 transition-colors">
                Terms of Service
              </Link>
              <span className="hidden sm:inline">•</span>
              <a
                href="mailto:hello@smartcamp.ai"
                className="hover:text-white/90 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
