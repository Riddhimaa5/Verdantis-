/**
 * AuditCard.jsx
 * Displays a single Audit record with status, scope, date, linked compliance issues,
 * and support for manager edit/delete actions.
 */

import { motion } from 'framer-motion'
import { Calendar, ClipboardList, Shield, Pencil, Trash2, FileText, Plus } from 'lucide-react'
import clsx from 'clsx'
import { useAudit } from '../../store/auditStore'
import { CURRENT_USER } from '../../store/csrStore'
import Button from '../common/Button'

const statusBadge = {
  scheduled:   'bg-blue-50 text-governance border-blue-100',
  in_progress: 'bg-amber-50 text-warn border-amber-100',
  under_review:'bg-violet-50 text-social border-violet-100',
  completed:   'bg-brand-50 text-brand-700 border-brand-100',
}

const statusLabel = {
  scheduled:   'Scheduled',
  in_progress: 'In Progress',
  under_review:'Under Review',
  completed:   'Completed',
}

export default function AuditCard({ audit, onEdit, onDelete, onAddIssue }) {
  const isManager = CURRENT_USER.role === 'manager'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 flex flex-col gap-4 border hover:shadow-card transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[11px] font-semibold text-ink-500 bg-ink-100 px-2 py-0.5 rounded-md">
              {audit.scope}
            </span>
            <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-md border capitalize',
              statusBadge[audit.status])}>
              {statusLabel[audit.status]}
            </span>
          </div>
          <h3 className="font-display font-semibold text-ink-800 text-[15px] leading-snug">
            {audit.title}
          </h3>
        </div>

        {isManager && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(audit)}
              className="p-1.5 rounded-md hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Edit audit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(audit.id)}
              className="p-1.5 rounded-md hover:bg-red-50 text-ink-400 hover:text-danger transition-colors"
              aria-label="Delete audit"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Audit Meta */}
      <div className="flex flex-col gap-2 bg-ink-50 p-3 rounded-lg text-xs text-ink-600">
        <div className="flex items-center justify-between">
          <span className="text-ink-400">Auditor:</span>
          <span className="font-medium text-ink-700">{audit.auditor}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-400">Scheduled Date:</span>
          <span className="font-medium text-ink-700 flex items-center gap-1">
            <Calendar size={11} /> {audit.date}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-400">Findings:</span>
          <span className={clsx('font-semibold font-mono',
            audit.findingsCount > 0 ? 'text-danger' : 'text-brand-600')}>
            {audit.findingsCount} Issues logged
          </span>
        </div>
      </div>

      {/* Report file link */}
      {audit.reportName && (
        <div className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
          <FileText size={12} />
          <span className="hover:underline cursor-pointer">{audit.reportName}</span>
        </div>
      )}

      {/* Action Strip */}
      {isManager && (
        <div className="pt-2 border-t border-ink-100 flex justify-end">
          <Button
            size="sm"
            variant="subtle"
            icon={Plus}
            onClick={() => onAddIssue(audit.id)}
          >
            Add Compliance Issue
          </Button>
        </div>
      )}
    </motion.div>
  )
}
