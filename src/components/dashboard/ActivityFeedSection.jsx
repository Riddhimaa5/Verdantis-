import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, ShieldCheck, Trophy, ClipboardCheck, CalendarClock, Activity } from 'lucide-react'
import { HDivider, VDivider } from '../common/Divider'
import { recentActivities, upcomingAudits, leaderboard } from '../../data/mockData'

const iconMap = {
  csr: { icon: Leaf, cls: 'text-brand-600 bg-brand-50' },
  audit: { icon: ClipboardCheck, cls: 'text-governance bg-blue-50' },
  governance: { icon: ShieldCheck, cls: 'text-governance bg-blue-50' },
  carbon: { icon: Leaf, cls: 'text-teal-600 bg-teal-50' },
  challenge: { icon: Trophy, cls: 'text-warn bg-amber-50' },
}

const statusStyles = {
  scheduled: 'text-brand-700 bg-brand-50',
  preparing: 'text-warn bg-amber-50',
}

export default function ActivityFeedSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-6 flex flex-col lg:flex-row gap-6"
    >
      {/* Recent activity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={15} className="text-ink-500" />
          <h3 className="font-display font-semibold text-ink-800 text-[15px]">Recent Activity</h3>
        </div>
        <div className="flex flex-col">
          {recentActivities.slice(0, 4).map((a, i, arr) => {
            const { icon: Icon, cls } = iconMap[a.type]
            return (
              <div key={a.id} className={`flex gap-3 py-2.5 ${i !== arr.length - 1 ? 'border-b border-ink-100' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${cls}`}>
                  <Icon size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] text-ink-700 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <HDivider className="lg:hidden" />
      <VDivider />

      {/* Upcoming audits */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock size={15} className="text-ink-500" />
          <h3 className="font-display font-semibold text-ink-800 text-[15px]">Upcoming Audits</h3>
        </div>
        <div className="flex flex-col">
          {upcomingAudits.map((audit, i) => (
            <div key={audit.id} className={`flex items-center gap-3 py-2.5 ${i !== upcomingAudits.length - 1 ? 'border-b border-ink-100' : ''}`}>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-ink-700 truncate">{audit.name}</p>
                <p className="text-[11px] text-ink-400">{audit.owner} · {audit.date}</p>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md shrink-0 capitalize ${statusStyles[audit.status]}`}>
                {audit.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <HDivider className="lg:hidden" />
      <VDivider />

      {/* Leaderboard */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={15} className="text-warn" />
            <h3 className="font-display font-semibold text-ink-800 text-[15px]">Top Contributors</h3>
          </div>
          <Link to="/leaderboard" className="text-xs font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        <div className="flex flex-col">
          {leaderboard.slice(0, 4).map((emp, i) => (
            <div key={emp.id} className="flex items-center gap-2.5 py-2">
              <span className="w-4 text-xs font-mono font-semibold text-ink-400">{i + 1}</span>
              <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.name.replace(' ', '')}`}
                alt={emp.name}
                className="w-7 h-7 rounded-full bg-ink-100 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-ink-700 truncate">{emp.name}</p>
              </div>
              <span className="text-xs font-mono font-semibold text-ink-600">{emp.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
