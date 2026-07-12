import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import AnimatedCounter from './AnimatedCounter'

/**
 * StatCard — used for KPI tiles (Carbon Emission, CSR Activities, Participation, Compliance)
 * trend: 'up' | 'down'; goodDirection: whether 'up' is a good outcome for this metric
 */
export default function StatCard({ icon: Icon, label, value, unit, delta, trend, goodDirection = 'up', accent = 'brand' }) {
  const isGood = trend === goodDirection
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight

  const accentMap = {
    brand: 'bg-brand-50 text-brand-600',
    social: 'bg-violet-50 text-social',
    governance: 'bg-blue-50 text-governance',
    teal: 'bg-teal-50 text-teal-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-5 flex flex-col gap-3 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between">
        <span className="text-sm text-ink-500 font-medium">{label}</span>
        {Icon && (
          <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', accentMap[accent])}>
            <Icon size={17} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="stat-number text-2xl text-ink-800">
          <AnimatedCounter value={value} decimals={0} />
        </span>
        <span className="text-sm text-ink-400 mb-0.5">{unit}</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={clsx(
            'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md',
            isGood ? 'text-brand-700 bg-brand-50' : 'text-danger bg-red-50',
          )}
        >
          <TrendIcon size={12} />
          {Math.abs(delta)}%
        </span>
        <span className="text-xs text-ink-400">vs last quarter</span>
      </div>
    </motion.div>
  )
}
