/**
 * Reports.jsx
 * Audits & Compliance Reports page at /reports.
 * Replacing placeholder. Reuses Sections, filters, stats, cards, and modals.
 */

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, ClipboardList, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

import { AuditProvider, useAudit, isIssueOverdue } from '../store/auditStore'
import { CURRENT_USER } from '../store/csrStore'
import Section from '../components/common/Section'
import Button from '../components/common/Button'
import AuditStatsBar from '../components/reports/AuditStatsBar'
import AuditCard from '../components/reports/AuditCard'
import AuditFormModal from '../components/reports/AuditFormModal'
import ComplianceIssueCard from '../components/reports/ComplianceIssueCard'
import ComplianceFormModal from '../components/reports/ComplianceFormModal'
import AuditDeleteConfirmModal from '../components/reports/AuditDeleteConfirmModal'
import ESGReportGenerator from '../components/reports/ESGReportGenerator'

const TABS = [
  { id: 'audits', label: 'Audits Schedule' },
  { id: 'issues', label: 'Compliance Issues' },
  { id: 'generator', label: 'ESG Reports & Export' },
]

const SEVERITY_FILTERS = [
  { id: 'all',      label: 'All Severities' },
  { id: 'critical', label: 'Critical' },
  { id: 'high',     label: 'High' },
  { id: 'medium',   label: 'Medium' },
  { id: 'low',      label: 'Low' },
]

function ReportsContent() {
  const { state, dispatch } = useAudit()
  const isManager = CURRENT_USER.role === 'manager'

  const [activeTab, setActiveTab] = useState('audits')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [auditFormOpen, setAuditFormOpen] = useState(false)
  const [auditEditTarget, setAuditEditTarget] = useState(null)
  
  const [issueFormOpen, setIssueFormOpen] = useState(false)
  const [issueEditTarget, setIssueEditTarget] = useState(null)
  const [initialAuditId, setInitialAuditId] = useState('')

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [deleteType, setDeleteType] = useState('audit') // audit | issue

  // ── Derived filtered lists ────────────────────────────────────────────────

  const filteredAudits = useMemo(() => {
    let list = [...state.audits]
    if (searchQuery.trim()) {
      list = list.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.scope.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    return list
  }, [state.audits, searchQuery])

  const filteredIssues = useMemo(() => {
    let list = [...state.issues]

    if (severityFilter !== 'all') {
      list = list.filter((i) => i.severity === severityFilter)
    }

    if (searchQuery.trim()) {
      list = list.filter((i) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.owner.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return list
  }, [state.issues, severityFilter, searchQuery])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEditAudit = (audit) => {
    setAuditEditTarget(audit)
    setAuditFormOpen(true)
  }

  const handleEditIssue = (issue) => {
    setIssueEditTarget(issue)
    setIssueFormOpen(true)
  }

  const handleDeleteAuditClick = (id) => {
    setDeleteType('audit')
    setDeleteTargetId(id)
  }

  const handleDeleteIssueClick = (id) => {
    setDeleteType('issue')
    setDeleteTargetId(id)
  }

  const openNewAudit = () => {
    setAuditEditTarget(null)
    setAuditFormOpen(true)
  }

  const openNewIssue = (auditId = '') => {
    setInitialAuditId(auditId)
    setIssueEditTarget(null)
    setIssueFormOpen(true)
  }

  function confirmDelete() {
    if (deleteType === 'audit') {
      dispatch({ type: 'DELETE_AUDIT', payload: deleteTargetId })
    } else {
      dispatch({ type: 'DELETE_ISSUE', payload: deleteTargetId })
    }
    setDeleteTargetId(null)
  }

  const deleteTitle =
    deleteType === 'audit'
      ? state.audits.find((a) => a.id === deleteTargetId)?.title
      : state.issues.find((i) => i.id === deleteTargetId)?.title

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="reports-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#reports-grid)" />
          </svg>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
            <ClipboardList size={11} /> Audits & Compliance
          </span>
          <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
            Audits & Reports
          </h2>
          <p className="text-ink-300 text-sm mt-2 leading-relaxed">
            Generate sustainability reports, monitor certifications, and verify corrective compliance tickets.
          </p>
        </div>

        {isManager && (
          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <button
              onClick={openNewAudit}
              className="inline-flex items-center gap-2 bg-white text-ink-900 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
            >
              <Plus size={15} />
              New Audit
            </button>
            <button
              onClick={() => openNewIssue('')}
              className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
            >
              <Plus size={15} />
              New Issue
            </button>
          </div>
        )}
      </motion.div>

      {/* Stats Summary */}
      <div className="print:hidden">
        <Section eyebrow="Snapshot" title="System Health Overview">
          <AuditStatsBar />
        </Section>
      </div>

      {/* Main Section */}
      <Section
        eyebrow="Compliance"
        title="Audit Logs & Reporting"
        subtitle="Manage certification catalogs, compliance tickets, and export sustainability data reports."
        className="print:p-0 print:border-none print:shadow-none print:bg-transparent"
      >
        {/* Toolbar */}
        <div className="flex flex-col gap-3 mb-6 print:hidden">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-ink-100/60 rounded-xl p-1 flex-wrap">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id)
                    setSearchQuery('')
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === t.id
                      ? 'bg-white text-ink-800 shadow-soft'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search */}
            {activeTab !== 'generator' && (
              <div className="flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-2 w-60 transition-colors">
                <Search size={14} className="text-ink-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'audits' ? 'Search audits…' : 'Search issues…'}
                  className="bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-400 w-full"
                />
              </div>
            )}
          </div>

          {/* Subfilters for compliance issues */}
          {activeTab === 'issues' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {SEVERITY_FILTERS.map((sev) => (
                <button
                  key={sev.id}
                  onClick={() => setSeverityFilter(sev.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    severityFilter === sev.id
                      ? 'bg-ink-800 text-white border-ink-800 shadow-sm'
                      : 'border-ink-200 text-ink-500 hover:border-ink-300 hover:text-ink-700'
                  }`}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Display Grid */}
        {activeTab === 'audits' && (
          filteredAudits.length === 0 ? (
            <div className="card flex flex-col items-center py-16 text-center text-ink-400">
              <ClipboardList size={28} className="mb-2 opacity-40" />
              <p className="text-sm font-medium">No audits scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAudits.map((audit) => (
                <AuditCard
                  key={audit.id}
                  audit={audit}
                  onEdit={handleEditAudit}
                  onDelete={handleDeleteAuditClick}
                  onAddIssue={openNewIssue}
                />
              ))}
            </div>
          )
        )}
        {activeTab === 'issues' && (
          filteredIssues.length === 0 ? (
            <div className="card flex flex-col items-center py-16 text-center text-ink-400">
              <ShieldAlert size={28} className="mb-2 opacity-40" />
              <p className="text-sm font-medium">No compliance issues logged.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <ComplianceIssueCard
                  key={issue.id}
                  issue={issue}
                  onEdit={handleEditIssue}
                  onDelete={handleDeleteIssueClick}
                />
              ))}
            </div>
          )
        )}
        {activeTab === 'generator' && (
          <ESGReportGenerator />
        )}
      </Section>

      {/* Forms & Modal Overlays */}
      <AuditFormModal
        open={auditFormOpen}
        onClose={() => setAuditFormOpen(false)}
        audit={auditEditTarget}
      />
      <ComplianceFormModal
        open={issueFormOpen}
        onClose={() => setIssueFormOpen(false)}
        issue={issueEditTarget}
        initialAuditId={initialAuditId}
      />
      <AuditDeleteConfirmModal
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title={deleteTitle || ''}
        type={deleteType}
      />
    </div>
  )
}

export default function Reports() {
  return (
    <AuditProvider>
      <ReportsContent />
    </AuditProvider>
  )
}
