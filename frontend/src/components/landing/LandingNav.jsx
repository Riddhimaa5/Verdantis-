import { Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'

export default function LandingNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Sprout size={17} className="text-white" strokeWidth={2.2} />
          </div>
          <span className="font-display font-bold text-ink-800 text-[16px]">Verdantis</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors">
            Product
          </a>
          <a href="#features" className="text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors">
            Features
          </a>
          <a href="#cta" className="text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors">
            Get Started
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-600 hover:text-ink-800 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}
