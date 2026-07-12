/**
 * Challenges.jsx — Sustainability Challenges page at /challenges
 *
 * Replaces <Placeholder name="Challenges" />.
 * Wrapped in <ChallengeProvider> so all children share one store.
 *
 * Features:
 *  - Stats bar (live)
 *  - Filter tabs: All / Active / Draft / Under Review / Completed / My Challenges
 *  - Difficulty filter pills
 *  - Search by title
 *  - Challenge cards (join, progress, proof, submit)
 *  - Manager: New Challenge, Edit, Delete, Manage participants
 *  - Participants modal: Approve (XP) / Reject (with note)
 */

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

import { ChallengeProvider, useChallenge, CURRENT_USER } from '../store/challengeStore'
import Section from '../components/common/Section'
import Button from '../components/common/Button'
import ChallengeStatsBar from '../components/challenges/ChallengeStatsBar'
import ChallengeCard from '../components/challenges/ChallengeCard'
import ChallengeFormModal from '../components/challenges/ChallengeFormModal'
import ChallengeParticipantsModal from '../components/challenges/ChallengeParticipantsModal'
import ChallengeDeleteConfirmModal from '../components/challenges/ChallengeDeleteConfirmModal'

// ─── filter config ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'all',          label: 'All' },
  { id: 'active',       label: 'Active' },
  { id: 'draft',        label: 'Draft' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'completed',    label: 'Completed' },
  { id: 'mine',         label: 'My Challenges' },
]

const DIFFICULTY_PILLS = [
  { id: 'all',    label: 'All levels' },
  { id: 'easy',   label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard',   label: 'Hard' },
]

// ─── inner component (lives inside provider) ──────────────────────────────────

function ChallengesContent() {
  const { state, dispatch } = useChallenge()
  const isManager = CURRENT_USER.role === 'manager'

  const [tab,          setTab]          = useState('all')
  const [difficulty,   setDifficulty]   = useState('all')
  const [query,        setQuery]        = useState('')
  const [formOpen,     setFormOpen]     = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [manageTarget, setManageTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── derived list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...state.challenges]

    if (tab === 'mine') {
      list = list.filter((c) =>
        state.participations.some(
          (p) => p.challengeId === c.id && p.employeeId === CURRENT_USER.id,
        ),
      )
    } else if (tab !== 'all') {
      list = list.filter((c) => c.status === tab)
    }

    if (difficulty !== 'all') {
      list = list.filter((c) => c.difficulty === difficulty)
    }

    if (query.trim()) {
      list = list.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()),
      )
    }

    return list
  }, [state.challenges, state.participations, tab, difficulty, query])

  // ── handlers ──────────────────────────────────────────────────────────────
  function openNew()  { setEditTarget(null); setFormOpen(true) }
  function openEdit(c) { setEditTarget(c);   setFormOpen(true) }
  function closeForm() { setEditTarget(null); setFormOpen(false) }

  function confirmDelete() {
    dispatch({ type: 'DELETE_CHALLENGE', payload: deleteTarget })
    setDeleteTarget(null)
  }

  const deleteChallenge = state.challenges.find((c) => c.id === deleteTarget)

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-10">

      {/* ── Hero banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="ch-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ch-grid)" />
          </svg>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-warn/20 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 bg-warn/10 border border-warn/20 px-2.5 py-1 rounded-full">
            <Zap size={11} /> Engagement
          </span>
          <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
            Sustainability Challenges
          </h2>
          <p className="text-ink-300 text-sm mt-2 leading-relaxed">
            Take on targeted sustainability goals, track your progress, and earn XP when your work is approved.
          </p>
        </div>

        {isManager && (
          <button
            onClick={openNew}
            className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-white text-ink-900 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Plus size={15} />
            New Challenge
          </button>
        )}
      </motion.div>

      {/* ── Stats bar ── */}
      <Section eyebrow="Overview" title="At a glance">
        <ChallengeStatsBar />
      </Section>

      {/* ── Challenges list ── */}
      <Section
        eyebrow="Challenges"
        title="All challenges"
        subtitle="Join a challenge, log your progress, and submit proof for review."
        action={
          isManager && (
            <Button variant="subtle" size="sm" icon={Plus} onClick={openNew}>
              Add challenge
            </Button>
          )
        }
      >
        {/* ── Toolbar ── */}
        <div className="flex flex-col gap-3 mb-5">
          {/* Tab row */}
          <div className="flex items-center gap-1 bg-ink-100/60 rounded-xl p-1 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-white text-ink-800 shadow-soft'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Difficulty + Search row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {DIFFICULTY_PILLS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    difficulty === d.id
                      ? 'bg-ink-800 text-white border-ink-800'
                      : 'border-ink-200 text-ink-500 hover:border-ink-300 hover:text-ink-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-2 w-60 transition-colors">
              <Search size={14} className="text-ink-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search challenges…"
                className="bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-400 w-full"
              />
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center py-16 text-center text-ink-400">
            <Filter size={28} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">No challenges match this filter.</p>
            <p className="text-xs mt-1">Try a different tab, difficulty, or clear your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onManage={setManageTarget}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── Modals ── */}
      <ChallengeFormModal
        open={formOpen}
        onClose={closeForm}
        challenge={editTarget}
      />
      <ChallengeParticipantsModal
        open={Boolean(manageTarget)}
        onClose={() => setManageTarget(null)}
        challenge={manageTarget}
      />
      <ChallengeDeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        challengeTitle={deleteChallenge?.title ?? ''}
      />
    </div>
  )
}

// ─── page export (provider is now global) ─────────────────────────────────────
export default function Challenges() {
  return <ChallengesContent />
}
