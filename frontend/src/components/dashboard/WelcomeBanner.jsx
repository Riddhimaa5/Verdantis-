import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { esgScore } from '../../data/mockData'

export default function WelcomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      {/* ambient texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="relative z-10 max-w-lg">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
          <Sparkles size={12} />
          Q3 sustainability review is live
        </span>
        <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
          Good morning, Ananya.
        </h2>
        <p className="text-ink-300 text-sm mt-2 leading-relaxed">
          Your ESG score climbed to <span className="text-white font-semibold">{esgScore.overall}</span> this
          quarter, up {esgScore.deltaOverall} points. Manufacturing emissions are trending down — here's where
          things stand today.
        </p>
      </div>

      <button className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-white text-ink-900 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors">
        View Q3 Report
        <ArrowRight size={15} />
      </button>
    </motion.div>
  )
}
