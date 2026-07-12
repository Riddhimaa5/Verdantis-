import { motion } from 'framer-motion'
import AnimatedCounter from '../common/AnimatedCounter'
import { ProgressBar } from '../common/ProgressCard'

const colorMap = {
  brand: { bar: 'bg-brand-600', text: 'text-brand-700', bg: 'bg-brand-50' },
  social: { bar: 'bg-social', text: 'text-social', bg: 'bg-violet-50' },
  governance: { bar: 'bg-governance', text: 'text-governance', bg: 'bg-blue-50' },
}

export default function ScoreCard({ label, score, icon: Icon, color = 'brand', delay = 0 }) {
  const c = colorMap[color]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="card p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-500 font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}>
          <Icon size={15} className={c.text} />
        </div>
      </div>
      <span className={`stat-number text-2xl ${c.text}`}>
        <AnimatedCounter value={score} />
      </span>
      <ProgressBar progress={score} color={c.bar} height="h-1.5" />
    </motion.div>
  )
}
