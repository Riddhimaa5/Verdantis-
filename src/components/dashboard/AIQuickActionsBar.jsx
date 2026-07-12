import { motion } from 'framer-motion'
import { Sparkles, TrendingDown, PlusCircle, HeartHandshake, FileBarChart, UserPlus } from 'lucide-react'

const actions = [
  { id: 1, label: 'Log Emission Data', icon: PlusCircle },
  { id: 2, label: 'Add CSR Activity', icon: HeartHandshake },
  { id: 3, label: 'Generate Report', icon: FileBarChart },
  { id: 4, label: 'Invite Employee', icon: UserPlus },
]

export default function AIQuickActionsBar({ recommendation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-6 flex flex-col lg:flex-row lg:items-center gap-6 bg-gradient-to-br from-brand-50/50 to-white"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-display font-semibold text-ink-800">{recommendation.title}</p>
          <p className="text-xs text-ink-500 mt-1 leading-relaxed max-w-xl">{recommendation.body}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 mt-2">
            <TrendingDown size={13} />
            {recommendation.impact} · {recommendation.confidence}
          </span>
        </div>
      </div>

      <div className="hidden lg:block w-px h-16 bg-brand-100 shrink-0" />

      <div className="flex flex-wrap gap-2 shrink-0">
        {actions.map((action) => (
          <button
            key={action.id}
            className="inline-flex items-center gap-2 text-xs font-medium text-ink-700 bg-white border border-ink-200 hover:border-brand-300 hover:text-brand-700 rounded-lg px-3 py-2 transition-colors"
          >
            <action.icon size={14} />
            {action.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
