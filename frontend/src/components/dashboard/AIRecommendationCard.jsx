import { motion } from 'framer-motion'
import { Sparkles, TrendingDown } from 'lucide-react'
import { aiRecommendation } from '../../data/mockData'

export default function AIRecommendationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-5 flex flex-col gap-3 bg-gradient-to-br from-brand-50/60 to-white border-brand-100"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-display font-semibold text-ink-800">AI Recommendation</p>
          <p className="text-[11px] text-ink-400">{aiRecommendation.confidence}</p>
        </div>
      </div>
      <p className="text-sm font-medium text-ink-700 leading-snug">{aiRecommendation.title}</p>
      <p className="text-xs text-ink-500 leading-relaxed">{aiRecommendation.body}</p>
      <div className="flex items-center justify-between mt-1 pt-3 border-t border-brand-100/70">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
          <TrendingDown size={13} />
          {aiRecommendation.impact}
        </span>
        <button className="text-xs font-medium text-ink-500 hover:text-ink-700">Dismiss</button>
      </div>
    </motion.div>
  )
}
