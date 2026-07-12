/**
 * Leaderboard.jsx
 * Sustainability leaderboard page at /leaderboard.
 * Displays list of employees ranked by total XP, with support for department filtering,
 * automatic badge display, and dynamic rank styling.
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Search, Filter, ShieldCheck, Flame, Users, Sparkles } from 'lucide-react'
import { useGamification, getUnlockedBadges } from '../store/gamificationStore'
import Section from '../components/common/Section'

const DEPARTMENTS = [
  'All Departments',
  'Operations',
  'Manufacturing',
  'R&D',
  'Logistics',
  'Corporate',
]

export default function Leaderboard() {
  const { state } = useGamification()
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [searchQuery, setSearchQuery] = useState('')

  // Sort and filter employees
  const rankedEmployees = useMemo(() => {
    let list = [...state.employees]

    // filter department
    if (selectedDept !== 'All Departments') {
      list = list.filter((e) => e.department === selectedDept)
    }

    // search name
    if (searchQuery.trim()) {
      list = list.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // rank by XP descending
    return list.sort((a, b) => b.xp - a.xp)
  }, [state.employees, selectedDept, searchQuery])

  // Get current user details from state
  const currentUserObj = state.employees.find((e) => e.id === 'emp-current')
  const currentUserRank = useMemo(() => {
    const allSorted = [...state.employees].sort((a, b) => b.xp - a.xp)
    return allSorted.findIndex((e) => e.id === 'emp-current') + 1
  }, [state.employees])

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
              <pattern id="leaderboard-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaderboard-grid)" />
          </svg>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
            <Sparkles size={11} /> High Scores
          </span>
          <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
            Sustainability Leaderboard
          </h2>
          <p className="text-ink-300 text-sm mt-2 leading-relaxed">
            See who is leading the green revolution. Earn XP by completing CSR activities and challenges to rank up.
          </p>
        </div>

        {currentUserObj && (
          <div className="relative z-10 shrink-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3.5 text-white flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center font-display font-bold text-brand-300 text-lg">
              #{currentUserRank}
            </div>
            <div>
              <p className="text-xs text-ink-300">My Ranking</p>
              <p className="font-semibold text-[15px]">{currentUserObj.name}</p>
              <p className="font-mono text-xs text-brand-300 font-semibold">{currentUserObj.xp.toLocaleString()} XP</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Leaderboard Section */}
      <Section
        eyebrow="Standings"
        title="Eco Leaders"
        subtitle="Live ranking of contributors across all business units."
      >
        {/* Filters and search */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          {/* Department pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  selectedDept === dept
                    ? 'bg-ink-800 text-white border-ink-800 shadow-sm'
                    : 'border-ink-200 text-ink-500 hover:border-ink-300 hover:text-ink-700 hover:bg-ink-50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-2 w-64 transition-colors">
            <Search size={14} className="text-ink-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee…"
              className="bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-400 w-full"
            />
          </div>
        </div>

        {/* Leaderboard Table/List */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50 flex items-center justify-between text-xs font-semibold text-ink-500 uppercase tracking-wider">
            <div className="flex items-center gap-6 flex-1">
              <span className="w-10 text-center">Rank</span>
              <span>Employee</span>
            </div>
            <div className="flex items-center gap-12 text-right">
              <span className="w-28 hidden sm:block">Department</span>
              <span className="w-40 hidden md:block text-left">Badges</span>
              <span className="w-20">Score</span>
            </div>
          </div>

          <div className="divide-y divide-ink-100">
            {rankedEmployees.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center text-ink-400">
                <Filter size={28} className="mb-2 opacity-40" />
                <p className="text-sm font-medium">No records found.</p>
                <p className="text-xs mt-1">Try resetting the department or search query.</p>
              </div>
            ) : (
              rankedEmployees.map((emp, index) => {
                const globalRank = state.employees.sort((a, b) => b.xp - a.xp).findIndex((e) => e.id === emp.id) + 1
                const unlocked = getUnlockedBadges(emp.xp)
                const isSelf = emp.id === 'emp-current'

                // Medals for top 3
                const rankDisplay = {
                  1: <span className="text-lg">🥇</span>,
                  2: <span className="text-lg">🥈</span>,
                  3: <span className="text-lg">🥉</span>,
                }[globalRank] ?? <span className="font-mono text-sm font-semibold text-ink-400">{globalRank}</span>

                return (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-6 py-4 flex items-center justify-between transition-colors ${
                      isSelf ? 'bg-brand-50/30' : 'hover:bg-ink-50/50'
                    }`}
                  >
                    {/* Rank + User Identity */}
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="w-10 flex items-center justify-center shrink-0">
                        {rankDisplay}
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${emp.name.replace(' ', '')}`}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full bg-ink-100 shrink-0 border border-ink-100"
                        />
                        <div className="truncate">
                          <p className="text-sm font-medium text-ink-800 flex items-center gap-1.5">
                            {emp.name}
                            {isSelf && (
                              <span className="text-[10px] font-semibold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-ink-400 sm:hidden">{emp.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-12 text-right shrink-0">
                      {/* Department */}
                      <span className="w-28 text-sm text-ink-600 hidden sm:block truncate">
                        {emp.department}
                      </span>

                      {/* Badges list */}
                      <div className="w-40 hidden md:flex items-center gap-1 text-left flex-wrap">
                        {unlocked.map((b) => (
                          <span
                            key={b.id}
                            title={`${b.name}: ${b.description}`}
                            className="w-7 h-7 rounded-lg border border-ink-100 bg-white flex items-center justify-center text-sm cursor-help hover:scale-105 transition-transform"
                          >
                            {b.icon}
                          </span>
                        ))}
                        {unlocked.length === 0 && (
                          <span className="text-xs text-ink-300">No badges yet</span>
                        )}
                      </div>

                      {/* XP Score */}
                      <span className="w-20 font-mono font-bold text-ink-800 text-sm">
                        {emp.xp.toLocaleString()} <span className="text-[10px] font-sans font-medium text-ink-400">XP</span>
                      </span>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}
