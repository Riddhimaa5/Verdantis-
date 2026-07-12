import { Sprout } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="border-t border-ink-100">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
            <Sprout size={13} className="text-white" />
          </div>
          <span className="font-display font-semibold text-ink-700 text-sm">Verdantis</span>
          <span className="text-ink-300">·</span>
          <span className="text-xs text-ink-400">Intelligence for Sustainable Enterprises</span>
        </div>
        <p className="text-xs text-ink-400">&copy; 2026 Verdantis. All rights reserved.</p>
      </div>
    </footer>
  )
}
