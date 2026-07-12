/**
 * Employees.jsx
 * Employee badge page at /employees.
 * Displays all employees, their XP, unlocked badges, progress to next badge,
 * and standard badge system status (unlocked vs. locked).
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Search, Filter, ShieldAlert, BadgeInfo, Sparkles, CheckCircle2 } from 'lucide-react'
import { useGamification, BADGES, getUnlockedBadges } from '../store/gamificationStore'
import Section from '../components/common/Section'
import Modal from '../components/common/Modal'
import { ProgressBar } from '../components/common/ProgressCard'

export default function Employees() {
  const { state } = useGamification()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBadge, setSelectedBadge] = useState(null) // for detail modal

  // Filter employees
  const filteredEmployees = state.employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate next badge for an employee
  function getNextBadgeInfo(xp) {
    const nextBadge = BADGES.find((b) => xp < b.threshold)
    if (!nextBadge) {
      return { completed: true, percent: 100, remaining: 0, nextBadge: null }
    }
    const currentUnlocked = BADGES.filter((b) => xp >= b.threshold)
    const prevThreshold = currentUnlocked.length > 0 ? currentUnlocked[currentUnlocked.length - 1].threshold : 0
    const needed = nextBadge.threshold - prevThreshold
    const currentProgress = xp - prevThreshold
    const percent = Math.min(100, Math.max(0, Math.round((currentProgress / needed) * 100)))

    return {
      completed: false,
      percent,
      remaining: nextBadge.threshold - xp,
      nextBadge,
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="badges-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#badges-grid)" />
          </svg>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 bg-social/10 border border-social/20 px-2.5 py-1 rounded-full">
            <Award size={11} /> Badges & Recognition
          </span>
          <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
            Employee Badges
          </h2>
          <p className="text-ink-300 text-sm mt-2 leading-relaxed">
            Monitor sustainability achievements, view unlocked accomplishments, and inspect progress toward key milestones.
          </p>
        </div>
      </motion.div>

      {/* Badges system overview section */}
      <Section
        eyebrow="Badge Guide"
        title="Eco Accomplishments"
        subtitle="Unlocks automatically as your green contribution XP increases."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className="card p-4 flex flex-col items-center text-center gap-2 hover:shadow-card transition-shadow cursor-pointer border hover:border-ink-200"
            >
              <span className="text-3xl filter drop-shadow">{badge.icon}</span>
              <p className="text-sm font-semibold text-ink-800">{badge.name}</p>
              <span className="text-[10px] font-mono font-medium text-ink-400 bg-ink-100 rounded px-1.5 py-0.5">
                {badge.threshold.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Employees Directory with Badges */}
      <Section
        eyebrow="Profiles"
        title="Employee Accomplishments"
        subtitle="View all eco warrior profiles and their progression details."
        action={
          <div className="flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-1.5 w-60 transition-colors">
            <Search size={14} className="text-ink-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team member…"
              className="bg-transparent outline-none text-xs text-ink-700 placeholder:text-ink-400 w-full"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.length === 0 ? (
            <div className="card col-span-full flex flex-col items-center py-16 text-center text-ink-400">
              <Filter size={28} className="mb-2 opacity-40" />
              <p className="text-sm font-medium">No employee records match your search.</p>
            </div>
          ) : (
            filteredEmployees.map((emp) => {
              const unlocked = getUnlockedBadges(emp.xp)
              const isSelf = emp.id === 'emp-current'
              const nextBadgeInfo = getNextBadgeInfo(emp.xp)

              return (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card p-5 flex flex-col gap-4 border hover:shadow-card transition-shadow ${
                    isSelf ? 'border-brand-200 shadow-soft ring-1 ring-brand-100' : ''
                  }`}
                >
                  {/* Identity */}
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.name.replace(' ', '')}`}
                      alt={emp.name}
                      className="w-12 h-12 rounded-full bg-ink-100 shrink-0 border border-ink-100"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-ink-800 text-sm flex items-center gap-2">
                        {emp.name}
                        {isSelf && (
                          <span className="text-[10px] font-semibold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-ink-400">{emp.department}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm font-bold text-ink-800">{emp.xp.toLocaleString()}</p>
                      <p className="text-[10px] text-ink-400 font-medium">TOTAL XP</p>
                    </div>
                  </div>

                  {/* Badges Collection grid */}
                  <div>
                    <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-2">
                      Achievements ({unlocked.length} / {BADGES.length})
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {BADGES.map((b) => {
                        const hasUnlocked = emp.xp >= b.threshold
                        return (
                          <span
                            key={b.id}
                            onClick={() => setSelectedBadge(b)}
                            title={`${b.name}: ${b.description}`}
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg cursor-pointer transition-all ${
                              hasUnlocked
                                ? 'bg-white border-ink-200 hover:scale-105 shadow-sm'
                                : 'bg-ink-50/50 border-dashed border-ink-200 opacity-40 hover:opacity-60'
                            }`}
                          >
                            {b.icon}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Progression to Next Badge */}
                  <div className="pt-2 border-t border-ink-100 flex flex-col gap-1.5">
                    {nextBadgeInfo.completed ? (
                      <div className="flex items-center gap-1.5 text-xs text-brand-700 font-semibold bg-brand-50 rounded-lg px-2.5 py-1.5">
                        <CheckCircle2 size={13} />
                        All accomplishments unlocked!
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink-400">Next: <span className="font-semibold text-ink-600">{nextBadgeInfo.nextBadge?.name}</span></span>
                          <span className="font-mono font-medium text-ink-500">{nextBadgeInfo.remaining.toLocaleString()} XP left</span>
                        </div>
                        <ProgressBar progress={nextBadgeInfo.percent} height="h-1.5" />
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </Section>

      {/* Badge detail popup */}
      <Modal
        open={Boolean(selectedBadge)}
        onClose={() => setSelectedBadge(null)}
        title="Badge Details"
      >
        {selectedBadge && (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <span className="text-6xl filter drop-shadow-md animate-bounce">{selectedBadge.icon}</span>
            <div>
              <h4 className="font-display font-bold text-ink-800 text-lg">{selectedBadge.name}</h4>
              <span className="inline-block font-mono text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 mt-1">
                Required: {selectedBadge.threshold.toLocaleString()} XP
              </span>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed max-w-sm mt-1">
              {selectedBadge.description}
            </p>
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-4 bg-ink-800 hover:bg-ink-900 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
            >
              Close Guide
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
