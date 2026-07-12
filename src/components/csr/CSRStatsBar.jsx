/**
 * CSRStatsBar.jsx
 * Top summary strip — mirrors the KPI tiles on the Dashboard but scoped to CSR.
 * Reads live values from the CSR store so totals update with every action.
 */

import { motion } from 'framer-motion'
import { HeartHandshake, Clock, DollarSign, Star } from 'lucide-react'
import AnimatedCounter from '../common/AnimatedCounter'
import { useCSR, CURRENT_USER } from '../../store/csrStore'

export default function CSRStatsBar() {
  const { state } = useCSR()

  const activeCount = state.activities.filter((a) => a.status === 'active').length
  const approvedParts = state.participations.filter((p) => p.status === 'approved')
  const totalHours = approvedParts.reduce((sum, p) => {
    const act = state.activities.find((a) => a.id === p.activityId)
    return sum + (act?.hoursAwarded ?? 0)
  }, 0)
  const myXP = state.xpLedger[CURRENT_USER.id] ?? 0
  const totalParticipants = new Set(
    state.participations.filter((p) => p.status !== 'rejected').map((p) => p.employeeId),
  ).size

  const tiles = [
    { icon: HeartHandshake, label: 'Active Activities', value: activeCount, unit: '', accent: 'text-brand-600 bg-brand-50' },
    { icon: Clock, label: 'Hours Logged', value: totalHours, unit: 'hrs', accent: 'text-teal-600 bg-teal-50' },
    { icon: Star, label: 'My XP Earned', value: myXP, unit: 'XP', accent: 'text-warn bg-amber-50' },
    { icon: DollarSign, label: 'Participants', value: totalParticipants, unit: 'employees', accent: 'text-social bg-violet-50' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="card p-4 flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.accent}`}>
            <t.icon size={18} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink-400 font-medium truncate">{t.label}</p>
            <p className="font-mono font-bold text-xl text-ink-800 leading-tight">
              <AnimatedCounter value={t.value} />
              {t.unit && <span className="text-xs font-sans font-medium text-ink-400 ml-1">{t.unit}</span>}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
