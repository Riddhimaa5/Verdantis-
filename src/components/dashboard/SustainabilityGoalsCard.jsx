import ChartCard from '../common/ChartCard'
import { GoalRow } from '../common/ProgressCard'
import { sustainabilityGoals } from '../../data/mockData'

const colors = ['bg-brand-600', 'bg-teal-600', 'bg-social', 'bg-governance']

export default function SustainabilityGoalsCard() {
  return (
    <ChartCard title="Sustainability Goals" subtitle="Long-term commitments and progress">
      <div className="flex flex-col gap-5">
        {sustainabilityGoals.map((goal, i) => (
          <GoalRow key={goal.id} label={goal.label} progress={goal.progress} due={goal.due} color={colors[i % colors.length]} />
        ))}
      </div>
    </ChartCard>
  )
}
