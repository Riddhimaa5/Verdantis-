import { CalendarClock } from 'lucide-react'
import ChartCard from '../common/ChartCard'
import { upcomingAudits } from '../../data/mockData'

const statusStyles = {
  scheduled: 'text-brand-700 bg-brand-50',
  preparing: 'text-warn bg-amber-50',
}

export default function UpcomingAuditsCard() {
  return (
    <ChartCard title="Upcoming Audits" subtitle="Compliance calendar">
      <div className="flex flex-col gap-1">
        {upcomingAudits.map((audit) => (
          <div key={audit.id} className="flex items-center gap-3 py-2.5 border-b border-ink-100 last:border-0">
            <div className="w-9 h-9 rounded-lg bg-ink-50 flex items-center justify-center shrink-0">
              <CalendarClock size={16} className="text-ink-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-700 truncate">{audit.name}</p>
              <p className="text-xs text-ink-400">{audit.owner} · {audit.date}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-md shrink-0 capitalize ${statusStyles[audit.status]}`}>
              {audit.status}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
