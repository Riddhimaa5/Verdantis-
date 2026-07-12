/**
 * AuditStatsBar.jsx
 * Summary figures for Audits and Compliance.
 */

import { motion } from 'framer-motion'
import { ClipboardList, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react'
import AnimatedCounter from '../common/AnimatedCounter'
import { useAudit, isIssueOverdue } from '../../store/auditStore'

export default function AuditStatsBar() {
  const { state } = useAudit()

  const totalAudits = state.audits.length

  const openIssues = state.issues.filter((i) => i.status !== 'resolved')
  const openCount = openIssues.length

  const overdueCount = openIssues.filter((i) => isIssueOverdue(i)).length

  // Resolution Rate
  const resolvedCount = state.issues.filter((i) => i.status === 'resolved').length
  const totalIssues = state.issues.length
  const resolutionRate =
    totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 100

  const tiles = [
    {
      icon: ClipboardList,
      label: 'Total Audits',
      value: totalAudits,
      unit: 'runs',
      accent: 'text-brand-600 bg-brand-50',
    },
    {
      icon: ShieldAlert,
      label: 'Open Issues',
      value: openCount,
      unit: 'active',
      accent: 'text-governance bg-blue-50',
    },
    {
      icon: AlertTriangle,
      label: 'Overdue Items',
      value: overdueCount,
      unit: 'critical',
      accent: 'text-danger bg-red-50',
    },
    {
      icon: CheckCircle2,
      label: 'Resolution Rate',
      value: resolutionRate,
      unit: '%',
      accent: 'text-teal-600 bg-teal-50',
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
