import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section id="cta" className="max-w-6xl mx-auto px-6 py-20 md:py-24">
      <div className="relative overflow-hidden rounded-2xl bg-ink-900 px-8 py-14 md:px-16 md:py-16 text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-brand-500/20 blur-[100px]" />
        <div className="relative">
          <h2 className="font-display font-bold text-white text-2xl md:text-3xl leading-tight max-w-xl mx-auto">
            Make sustainability measurable across your entire organization
          </h2>
          <p className="text-ink-300 text-[15px] mt-4 max-w-lg mx-auto">
            Open the dashboard to see live scores, emissions trends, and employee engagement — all in one view.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-ink-900 text-sm font-semibold px-5 py-3 rounded-lg hover:bg-brand-50 transition-colors mt-8"
          >
            Open Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
