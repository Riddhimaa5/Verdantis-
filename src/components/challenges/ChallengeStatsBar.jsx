/**
 * ChallengeStatsBar.jsx
 * Live KPI strip for the Challenges page — reads directly from the store.
 */

import { motion } from 'framer-motion'
import { Trophy, CheckCircle2, Star, TrendingUp } from 'lucide-react'
import AnimatedCounter from '../common/AnimatedCounter'
import { useChallenge, CURRENT_USER } from '../../store/challengeStore'

export default function ChallengeStatsBar() {
  const { state } = useChallenge()

  const activeCount = state.challenges.filter((c) => c.status === 'active').length

  const approvedParts = state.participations.filter((p) => p.status === 'approved')
  const completedCount = approvedParts.length

  const myXP = state.xpLedger[CURRENT_USER.id] ?? 0

  const myParts = state.participations.filter((p) => p.employeeId === CURRENT_USER.id)
  const myAvgProgress =
    myParts.length > 0
      ? Math.round(myParts.reduce((s, p) => s + p.progress, 0) / myParts.length)
      : 0

  const tiles = [
    {
      icon: Trophy,
      label: 'Active Challenges',
      value: activeCount,
      unit: '',
      accent: 'text-warn bg-amber-50',
    },
    {
      icon: CheckCircle2,
      label: 'Completions Approved',
      value: completedCount,
      unit: 'total',
      accent: 'text-brand-600 bg-brand-50',
    },
    {
      icon: Star,
      label: 'My XP Earned',
      value: myXP,
      unit: 'XP',
      accent: 'text-social bg-violet-50',
    },
    {
      icon: TrendingUp,
      label: 'My Avg Progress',
      value: myAvgProgress,
      unit: '%',
      accent: 'text-governance bg-blue-50',
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
