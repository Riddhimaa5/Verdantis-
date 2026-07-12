import { Link } from 'react-router-dom'
import ChartCard from '../common/ChartCard'
import { leaderboard } from '../../data/mockData'

export default function LeaderboardWidget() {
  return (
    <ChartCard
      title="Employee Leaderboard"
      subtitle="Top sustainability contributors this month"
      action={
        <Link to="/leaderboard" className="text-xs font-medium text-brand-600 hover:text-brand-700">
          View all
        </Link>
      }
    >
      <div className="flex flex-col gap-1">
        {leaderboard.map((emp, i) => (
          <div key={emp.id} className="flex items-center gap-3 py-2">
            <span className="w-5 text-sm font-mono font-semibold text-ink-400">{i + 1}</span>
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.name.replace(' ', '')}`}
              alt={emp.name}
              className="w-8 h-8 rounded-full bg-ink-100 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-700 truncate">{emp.name}</p>
              <p className="text-xs text-ink-400">{emp.department}</p>
            </div>
            {emp.badge && <span className="text-base">{emp.badge}</span>}
            <span className="text-sm font-mono font-semibold text-ink-700 w-16 text-right">
              {emp.xp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
