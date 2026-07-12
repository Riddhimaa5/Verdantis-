import { HeartHandshake } from 'lucide-react'
import ChartCard from '../common/ChartCard'
import { ProgressBar } from '../common/ProgressCard'
import AnimatedCounter from '../common/AnimatedCounter'
import { csrProgress } from '../../data/mockData'

export default function CSRProgressCard() {
  const pct = Math.round((csrProgress.completed / csrProgress.total) * 100)
  return (
    <ChartCard
      title="CSR Progress"
      subtitle={`${csrProgress.completed} of ${csrProgress.total} activities completed`}
      action={
        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
          <HeartHandshake size={16} className="text-brand-600" />
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <ProgressBar progress={pct} />
        <span className="text-sm font-mono font-semibold text-ink-700 w-10 text-right">{pct}%</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-1">
        <div>
          <p className="text-lg font-mono font-semibold text-ink-800">
            <AnimatedCounter value={csrProgress.hoursLogged} />
          </p>
          <p className="text-xs text-ink-400">Volunteer hours logged</p>
        </div>
        <div>
          <p className="text-lg font-mono font-semibold text-ink-800">
            $<AnimatedCounter value={csrProgress.fundsRaised} />
          </p>
          <p className="text-xs text-ink-400">Funds raised</p>
        </div>
      </div>
    </ChartCard>
  )
}
