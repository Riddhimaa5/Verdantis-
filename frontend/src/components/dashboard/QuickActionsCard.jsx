import { PlusCircle, HeartHandshake, FileBarChart, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

const actions = [
  { id: 1, label: 'Log Emission Data', icon: PlusCircle },
  { id: 2, label: 'Add CSR Activity', icon: HeartHandshake },
  { id: 3, label: 'Generate Report', icon: FileBarChart },
  { id: 4, label: 'Invite Employee', icon: UserPlus },
]

export default function QuickActionsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-5"
    >
      <h3 className="font-display font-semibold text-ink-800 text-[15px] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex flex-col items-start gap-2.5 p-3.5 rounded-xl border border-ink-100 hover:border-brand-200 hover:bg-brand-50/40 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-ink-50 flex items-center justify-center">
              <action.icon size={16} className="text-brand-600" />
            </div>
            <span className="text-xs font-medium text-ink-700 leading-snug">{action.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
