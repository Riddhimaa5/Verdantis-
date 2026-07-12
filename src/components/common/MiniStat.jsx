import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import AnimatedCounter from './AnimatedCounter'

export default function MiniStat({ icon: Icon, label, value, unit, delta, trend, goodDirection = 'up', accent = 'text-brand-600' }) {
  const isGood = trend === goodDirection
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight

  return (
    <div className="flex-1 min-w-[128px]">
      <div className="flex items-center gap-1.5 text-ink-400 mb-1.5">
        {Icon && <Icon size={13} className={accent} />}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="stat-number text-xl text-ink-800">
          <AnimatedCounter value={value} />
        </span>
        {unit && <span className="text-xs text-ink-400">{unit}</span>}
      </div>
      {typeof delta === 'number' && (
        <span
          className={clsx(
            'inline-flex items-center gap-0.5 text-[11px] font-medium mt-1',
            isGood ? 'text-brand-700' : 'text-danger',
          )}
        >
          <TrendIcon size={11} />
          {Math.abs(delta)}% vs last qtr
        </span>
      )}
    </div>
  )
}
