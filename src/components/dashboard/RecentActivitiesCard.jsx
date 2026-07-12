import { Leaf, ShieldCheck, Trophy, ClipboardCheck } from 'lucide-react'
import ChartCard from '../common/ChartCard'
import { recentActivities } from '../../data/mockData'

const iconMap = {
  csr: { icon: Leaf, cls: 'text-brand-600 bg-brand-50' },
  audit: { icon: ClipboardCheck, cls: 'text-governance bg-blue-50' },
  governance: { icon: ShieldCheck, cls: 'text-governance bg-blue-50' },
  carbon: { icon: Leaf, cls: 'text-teal-600 bg-teal-50' },
  challenge: { icon: Trophy, cls: 'text-warn bg-amber-50' },
}

export default function RecentActivitiesCard() {
  return (
    <ChartCard title="Recent Activities" subtitle="Latest updates across the organization">
      <div className="flex flex-col">
        {recentActivities.map((a, i) => {
          const { icon: Icon, cls } = iconMap[a.type]
          return (
            <div
              key={a.id}
              className={`flex gap-3 py-3 ${i !== recentActivities.length - 1 ? 'border-b border-ink-100' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cls}`}>
                <Icon size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-ink-700 leading-snug">{a.text}</p>
                <p className="text-xs text-ink-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
}
