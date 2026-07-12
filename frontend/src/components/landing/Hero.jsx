import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import ESGGauge from '../common/ESGGauge'
import { esgScore, company } from '../../data/mockData'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>
      <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-brand-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-social/10 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full">
            <Sparkles size={12} />
            AI-powered ESG intelligence
          </span>
          <h1 className="font-display font-bold text-white text-4xl md:text-[52px] leading-[1.05] mt-5">
            Verdantis
          </h1>
          <p className="text-brand-200 font-medium text-lg md:text-xl mt-2">
            Intelligence for Sustainable Enterprises
          </p>
          <p className="text-ink-300 text-[15px] leading-relaxed mt-5 max-w-md">
            Verdantis brings your carbon accounting, CSR programs, governance compliance, and employee engagement
            into one platform — so sustainability stops living in spreadsheets and starts driving decisions.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-ink-900 text-sm font-semibold px-5 py-3 rounded-lg hover:bg-brand-50 transition-colors"
            >
              Open Dashboard
              <ArrowRight size={16} />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/20 px-5 py-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              What is Verdantis?
            </a>
          </div>

          <div className="flex items-center gap-6 mt-10 text-ink-400 text-xs">
            <span>Trusted by sustainability teams at</span>
            <span className="font-display font-semibold text-ink-300">Meridian Foods</span>
            <span className="font-display font-semibold text-ink-300">Northgate Retail</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Live ESG Score</p>
              <span className="flex items-center gap-1 text-[11px] text-brand-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-ink-400 mb-4">{company.name}</p>
            <ESGGauge
              overall={esgScore.overall}
              environmental={esgScore.environmental}
              social={esgScore.social}
              governance={esgScore.governance}
              size={230}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
