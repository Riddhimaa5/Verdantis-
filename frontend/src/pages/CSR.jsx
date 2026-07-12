/**
 * CSR.jsx — CSR Activities page
 *
 * Replaces the <Placeholder name="CSR Activities" /> at /csr.
 * The CSRProvider is mounted here so all child components share one store.
 *
 * Features:
 *  - Stats bar (live totals from store)
 *  - Filter tabs: All / Active / Completed / My Activities
 *  - Search by title
 *  - Activity cards (join, leave, upload proof)
 *  - Manager: Add activity (+ button), Edit, Delete, Manage participants
 *  - Participants modal with Approve (→ XP awarded) / Reject (with note)
 */

import { useState, useMemo } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

import { CSRProvider, useCSR, CURRENT_USER } from '../store/csrStore'
import Section from '../components/common/Section'
import Button from '../components/common/Button'
import CSRStatsBar from '../components/csr/CSRStatsBar'
import CSRActivityCard from '../components/csr/CSRActivityCard'
import CSRActivityFormModal from '../components/csr/CSRActivityFormModal'
import CSRParticipantsModal from '../components/csr/CSRParticipantsModal'
import CSRDeleteConfirmModal from '../components/csr/CSRDeleteConfirmModal'

// ─── tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'mine', label: 'My Activities' },
]

// ─── inner component (needs CSRProvider in scope) ──────────────────────────────
function CSRContent() {
  const { state, dispatch } = useCSR()
  const isManager = CURRENT_USER.role === 'manager'

  // UI state
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [manageTarget, setManageTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Derived list
  const filtered = useMemo(() => {
    let list = [...state.activities]
    if (tab === 'active') list = list.filter((a) => a.status === 'active')
    if (tab === 'completed') list = list.filter((a) => a.status === 'completed')
    if (tab === 'mine')
      list = list.filter((a) =>
        state.participations.some(
          (p) => p.activityId === a.id && p.employeeId === CURRENT_USER.id,
        ),
      )
    if (query.trim())
      list = list.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()),
      )
    return list
  }, [state.activities, state.participations, tab, query])

  function handleEdit(activity) {
    setEditTarget(activity)
    setFormOpen(true)
  }

  function handleDelete(id) {
    setDeleteTarget(id)
  }

  function confirmDelete() {
    dispatch({ type: 'DELETE_ACTIVITY', payload: deleteTarget })
    setDeleteTarget(null)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  const deleteActivity = state.activities.find((a) => a.id === deleteTarget)

  return (
    <div className="flex flex-col gap-10">
      {/* Page hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="csr-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#csr-grid)" />
          </svg>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-social/20 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 bg-social/10 border border-social/20 px-2.5 py-1 rounded-full">
            Social pillar
          </span>
          <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
            CSR Activities
          </h2>
          <p className="text-ink-300 text-sm mt-2 leading-relaxed">
            Join community activities, log your hours, and earn XP for every approved participation.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => { setEditTarget(null); setFormOpen(true) }}
            className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-white text-ink-900 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Plus size={15} />
            New Activity
          </button>
        )}
      </motion.div>

      {/* Stats bar */}
      <Section eyebrow="Overview" title="At a glance">
        <CSRStatsBar />
      </Section>

      {/* Activities list */}
      <Section
        eyebrow="Activities"
        title="All programs"
        subtitle="Browse, join, and track your community impact."
        action={
          isManager && (
            <Button
              variant="subtle"
              size="sm"
              icon={Plus}
              onClick={() => { setEditTarget(null); setFormOpen(true) }}
            >
              Add activity
            </Button>
          )
        }
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-ink-100/60 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-white text-ink-800 shadow-soft'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-2 w-60 transition-colors">
            <Search size={14} className="text-ink-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activities…"
              className="bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-400 w-full"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center py-16 text-center text-ink-400">
            <Filter size={28} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">No activities match this filter.</p>
            <p className="text-xs mt-1">Try a different tab or clear your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((activity) => (
              <CSRActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManage={setManageTarget}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Modals */}
      <CSRActivityFormModal
        open={formOpen}
        onClose={closeForm}
        activity={editTarget}
      />
      <CSRParticipantsModal
        open={Boolean(manageTarget)}
        onClose={() => setManageTarget(null)}
        activity={manageTarget}
      />
      <CSRDeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        activityTitle={deleteActivity?.title ?? ''}
      />
    </div>
  )
}

// ─── page export (provider is now global) ─────────────────────────────────────
export default function CSR() {
  return <CSRContent />
}
