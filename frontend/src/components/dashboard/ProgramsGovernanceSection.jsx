import { HeartHandshake, ShieldCheck, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { GoalRow, ProgressBar } from '../common/ProgressCard'
import AnimatedCounter from '../common/AnimatedCounter'
import { HDivider, VDivider } from '../common/Divider'
import { sustainabilityGoals, csrProgress, governanceProgress } from '../../data/mockData'

const goalColors = ['bg-brand-600', 'bg-teal-600', 'bg-social', 'bg-governance']

export default function ProgramsGovernanceSection() {
  const csrPct = Math.round((csrProgress.completed / csrProgress.total) * 100)
  const govPct = Math.round((governanceProgress.policiesReviewed / governanceProgress.policiesTotal) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-6 flex flex-col lg:flex-row gap-6"
    >
      {/* Sustainability goals */}
      <div className="flex-[1.2] min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <Target size={15} className="text-brand-600" />
          <h3 className="font-display font-semibold text-ink-800 text-[15px]">Sustainability Goals</h3>
        </div>
        <div className="flex flex-col gap-4">
          {sustainabilityGoals.map((goal, i) => (
            <GoalRow key={goal.id} label={goal.label} progress={goal.progress} due={goal.due} color={goalColors[i % goalColors.length]} />
          ))}
        </div>
      </div>

      <HDivider className="lg:hidden" />
      <VDivider />

      {/* CSR progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <HeartHandshake size={15} className="text-brand-600" />
          <h3 className="font-display font-semibold text-ink-800 text-[15px]">CSR Progress</h3>
        </div>
        <p className="text-xs text-ink-400 mb-3">{csrProgress.completed} of {csrProgress.total} activities completed</p>
        <div className="flex items-center gap-3 mb-4">
          <ProgressBar progress={csrPct} />
          <span className="text-sm font-mono font-semibold text-ink-700 w-10 text-right">{csrPct}%</span>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-lg font-mono font-semibold text-ink-800">
              <AnimatedCounter value={csrProgress.hoursLogged} />
            </p>
            <p className="text-xs text-ink-400">Hours logged</p>
          </div>
          <div>
            <p className="text-lg font-mono font-semibold text-ink-800">
              $<AnimatedCounter value={csrProgress.fundsRaised} />
            </p>
            <p className="text-xs text-ink-400">Funds raised</p>
          </div>
        </div>
      </div>

      <HDivider className="lg:hidden" />
      <VDivider />

      {/* Governance progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={15} className="text-governance" />
          <h3 className="font-display font-semibold text-ink-800 text-[15px]">Governance Progress</h3>
        </div>
        <p className="text-xs text-ink-400 mb-3">{governanceProgress.policiesReviewed} of {governanceProgress.policiesTotal} policies reviewed</p>
        <div className="flex items-center gap-3 mb-4">
          <ProgressBar progress={govPct} color="bg-governance" />
          <span className="text-sm font-mono font-semibold text-ink-700 w-10 text-right">{govPct}%</span>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-lg font-mono font-semibold text-ink-800">{governanceProgress.score}</p>
            <p className="text-xs text-ink-400">Governance score</p>
          </div>
          <div>
            <p className="text-lg font-mono font-semibold text-warn">{governanceProgress.openRisks}</p>
            <p className="text-xs text-ink-400">Open risks</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
