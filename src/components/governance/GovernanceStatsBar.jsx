/**
 * GovernanceStatsBar.jsx
 * Top stats strip for Policies page — counts compliance, policies, and ethics.
 */

import { motion } from 'framer-motion'
import { ShieldAlert, BookOpen, CheckCircle, BarChart3 } from 'lucide-react'
import AnimatedCounter from '../common/AnimatedCounter'
import { usePolicy } from '../../store/policyStore'
import { CURRENT_USER } from '../../store/csrStore'

export default function GovernanceStatsBar() {
  const { state } = usePolicy()

  const totalActive = state.policies.filter((p) => p.status === 'active').length

  // User actions needed
  const pendingUserAction = state.policies.filter((p) => {
    if (p.status !== 'active') return false
    const ack = state.acknowledgements.find(
      (a) => a.policyId === p.id && a.employeeId === CURRENT_USER.id,
    )
    return ack?.status !== 'acknowledged'
  }).length

  // Global acknowledgement rate
  const activePolicyIds = state.policies.filter((p) => p.status === 'active').map((p) => p.id)
  const activeAcks = state.acknowledgements.filter((ack) =>
    activePolicyIds.includes(ack.policyId),
  )
  const acknowledgedCount = activeAcks.filter((ack) => ack.status === 'acknowledged').length
  const totalTargetAcks = activeAcks.length
  const complianceRate =
    totalTargetAcks > 0 ? Math.round((acknowledgedCount / totalTargetAcks) * 100) : 100

  const tiles = [
    {
      icon: BookOpen,
      label: 'Active Policies',
      value: totalActive,
      unit: '',
      accent: 'text-brand-600 bg-brand-50',
    },
    {
      icon: ShieldAlert,
      label: 'My Action Items',
      value: pendingUserAction,
      unit: 'pending',
      accent: 'text-warn bg-amber-50',
    },
    {
      icon: CheckCircle,
      label: 'Compliance Rate',
      value: complianceRate,
      unit: '%',
      accent: 'text-governance bg-blue-50',
    },
    {
      icon: BarChart3,
      label: 'Ethics Index',
      value: 98,
      unit: '/ 100',
      accent: 'text-social bg-violet-50',
    },
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
              {t.unit && (
                <span className="text-xs font-sans font-medium text-ink-400 ml-1">{t.unit}</span>
              )}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
