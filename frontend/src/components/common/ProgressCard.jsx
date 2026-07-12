import { motion } from 'framer-motion'
import clsx from 'clsx'

export function ProgressBar({ progress, color = 'bg-brand-600', track = 'bg-ink-100', height = 'h-2' }) {
  return (
    <div className={clsx('w-full rounded-full overflow-hidden', track, height)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={clsx('h-full rounded-full', color)}
      />
    </div>
  )
}

export function GoalRow({ label, progress, due, color = 'bg-brand-600' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-700">{label}</span>
        <span className="text-ink-400 text-xs">Target {due}</span>
      </div>
      <div className="flex items-center gap-3">
        <ProgressBar progress={progress} color={color} />
        <span className="text-xs font-mono font-medium text-ink-600 w-9 text-right">{progress}%</span>
      </div>
    </div>
  )
}
