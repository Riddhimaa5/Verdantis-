import { ShieldCheck } from 'lucide-react'
import ChartCard from '../common/ChartCard'
import { ProgressBar } from '../common/ProgressCard'
import { governanceProgress } from '../../data/mockData'

export default function GovernanceProgressCard() {
  const pct = Math.round((governanceProgress.policiesReviewed / governanceProgress.policiesTotal) * 100)
  return (
    <ChartCard
      title="Governance Progress"
      subtitle={`${governanceProgress.policiesReviewed} of ${governanceProgress.policiesTotal} policies reviewed`}
      action={
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <ShieldCheck size={16} className="text-governance" />
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <ProgressBar progress={pct} color="bg-governance" />
        <span className="text-sm font-mono font-semibold text-ink-700 w-10 text-right">{pct}%</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <div>
          <p className="text-lg font-mono font-semibold text-ink-800">{governanceProgress.score}</p>
          <p className="text-xs text-ink-400">Governance score</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-mono font-semibold text-warn">{governanceProgress.openRisks}</p>
          <p className="text-xs text-ink-400">Open risks</p>
        </div>
      </div>
    </ChartCard>
  )
}
