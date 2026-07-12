import { motion } from 'framer-motion'

export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`card p-5 flex flex-col gap-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-ink-800 text-[15px]">{title}</h3>
          {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}
