/**
 * Governance.jsx
 * ESG Policy and Governance Page at /governance.
 * Provides filters for all, active, draft, archived, search capability, policy card grids,
 * and forms + auditing log modals for complete CRUD policy control.
 */

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

import { PolicyProvider, usePolicy } from '../store/policyStore'
import { CURRENT_USER } from '../store/csrStore'
import Section from '../components/common/Section'
import Button from '../components/common/Button'
import GovernanceStatsBar from '../components/governance/GovernanceStatsBar'
import PolicyCard from '../components/governance/PolicyCard'
import PolicyFormModal from '../components/governance/PolicyFormModal'
import PolicyAcknowledgementsModal from '../components/governance/PolicyAcknowledgementsModal'
import PolicyDeleteConfirmModal from '../components/governance/PolicyDeleteConfirmModal'

const TABS = [
  { id: 'all',      label: 'All Policies' },
  { id: 'active',   label: 'Active' },
  { id: 'draft',    label: 'Drafts' },
  { id: 'archived', label: 'Archived' },
]

function GovernanceContent() {
  const { state, dispatch } = usePolicy()
  const isManager = CURRENT_USER.role === 'manager'

  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [manageTarget, setManageTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Derived filter list
  const filtered = useMemo(() => {
    let list = [...state.policies]

    if (tab !== 'all') {
      list = list.filter((p) => p.status === tab)
    }

    if (query.trim()) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.summary.toLowerCase().includes(query.toLowerCase()),
      )
    }

    return list
  }, [state.policies, tab, query])

  function handleEdit(policy) {
    setEditTarget(policy)
    setFormOpen(true)
  }

  function confirmDelete() {
    dispatch({ type: 'DELETE_POLICY', payload: deleteTarget })
    setDeleteTarget(null)
  }

  const deletePolicy = state.policies.find((p) => p.id === deleteTarget)

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
              <pattern id="gov-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gov-grid)" />
          </svg>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-governance/25 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
            <ShieldCheck size={11} strokeWidth={2.2} /> Governance & Compliance
          </span>
          <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
            ESG Policies & Code
          </h2>
          <p className="text-ink-300 text-sm mt-2 leading-relaxed">
            Review corporate mandates, track acknowledgment statuses, and verify regulatory audits.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => { setEditTarget(null); setFormOpen(true) }}
            className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-white text-ink-900 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Plus size={15} />
            New Policy
          </button>
        )}
      </motion.div>

      {/* Stats bar */}
      <Section eyebrow="Metrics" title="Compliance Dashboard">
        <GovernanceStatsBar />
      </Section>

      {/* Policies section */}
      <Section
        eyebrow="Governance"
        title="Corporate Guidelines"
        subtitle="Browse all official standards and complete mandatory acknowledgments."
        action={
          isManager && (
            <Button
              variant="subtle"
              size="sm"
              icon={Plus}
              onClick={() => { setEditTarget(null); setFormOpen(true) }}
            >
              Add policy
            </Button>
          )
        }
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          {/* Tabs */}
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

          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-2 w-60 transition-colors">
            <Search size={14} className="text-ink-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search policy titles..."
              className="bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-400 w-full"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center py-16 text-center text-ink-400">
            <Filter size={28} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">No policies found.</p>
            <p className="text-xs mt-1">Try another tab or clear search input.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onManage={setManageTarget}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Modals */}
      <PolicyFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        policy={editTarget}
      />
      <PolicyAcknowledgementsModal
        open={Boolean(manageTarget)}
        onClose={() => setManageTarget(null)}
        policy={manageTarget}
      />
      <PolicyDeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        policyTitle={deletePolicy?.title ?? ''}
      />
    </div>
  )
}

// ─── page export (provider is now global) ─────────────────────────────────────
export default function Governance() {
  return <GovernanceContent />
}
