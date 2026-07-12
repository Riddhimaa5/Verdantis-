/**
 * ComplianceIssueCard.jsx
 * Displays a single compliance issue, highlighting owner, severity, due date, status,
 * and automatically flagging overdue items.
 */

import { motion } from 'framer-motion'
import { Calendar, User, ShieldAlert, CheckCircle2, AlertTriangle, Play, Check } from 'lucide-react'
import clsx from 'clsx'
import { useAudit, isIssueOverdue } from '../../store/auditStore'
import { CURRENT_USER } from '../../store/csrStore'
import Button from '../common/Button'

const severityBadge = {
  low:      'bg-blue-50 text-governance border-blue-100',
  medium:   'bg-teal-50 text-teal-700 border-teal-100',
  high:     'bg-amber-50 text-warn border-amber-100',
  critical: 'bg-red-50 text-danger border-red-100 font-bold',
}

const statusColors = {
  open:        'bg-ink-100 text-ink-600',
  in_progress: 'bg-blue-50 text-governance',
  under_review:'bg-violet-50 text-social',
  resolved:    'bg-brand-50 text-brand-700',
  overdue:     'bg-red-100 text-danger font-semibold animate-pulse',
}

const statusLabel = {
  open:        'Open',
  in_progress: 'In Progress',
  under_review:'Under Review',
  resolved:    'Resolved',
  overdue:     'Overdue',
}

export default function ComplianceIssueCard({ issue, onEdit, onDelete }) {
  const { state, dispatch } = useAudit()
  const isManager = CURRENT_USER.role === 'manager'

  // Dynamic status evaluation — flag overdue if due date passed and not resolved
  const isOverdue = isIssueOverdue(issue)
  const currentStatus = isOverdue ? 'overdue' : issue.status

  // Linked audit name if any
  const linkedAudit = state.audits.find((a) => a.id === issue.auditId)

  function updateStatus(newStatus) {
    dispatch({ type: 'SET_ISSUE_STATUS', payload: { id: issue.id, status: newStatus } })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'card p-5 flex flex-col gap-4 border hover:shadow-card transition-shadow',
        isOverdue ? 'border-red-200 bg-red-50/5' : '',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={clsx('text-[10px] uppercase font-semibold px-2 py-0.5 rounded border tracking-wider',
              severityBadge[issue.severity])}>
              {issue.severity}
            </span>
            <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-md capitalize',
              statusColors[currentStatus])}>
              {statusLabel[currentStatus]}
            </span>
          </div>
          <h4 className="font-display font-semibold text-ink-800 text-[14px] leading-snug">
            {issue.title}
          </h4>
        </div>

        {isManager && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(issue)}
              className="p-1.5 rounded-md hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Edit issue"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(issue.id)}
              className="p-1.5 rounded-md hover:bg-red-50 text-ink-400 hover:text-danger transition-colors"
              aria-label="Delete issue"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-ink-500 leading-relaxed">
        {issue.description}
      </p>

      {/* Audit context link */}
      {linkedAudit && (
        <p className="text-[11px] text-ink-400">
          Source Audit: <span className="font-medium text-ink-600">{linkedAudit.title}</span>
        </p>
      )}

      {/* Fields Info */}
      <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-ink-100 py-3 bg-ink-50/20 px-1 rounded">
        <div className="flex items-center gap-1.5 min-w-0">
          <User size={13} className="text-ink-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-ink-400 uppercase tracking-wide leading-none mb-0.5">Owner</p>
            <p className="font-medium text-ink-700 truncate">{issue.owner}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar size={13} className={clsx('shrink-0', isOverdue ? 'text-danger' : 'text-ink-400')} />
          <div className="min-w-0">
            <p className="text-[10px] text-ink-400 uppercase tracking-wide leading-none mb-0.5">Due Date</p>
            <p className={clsx('font-medium', isOverdue ? 'text-danger font-semibold' : 'text-ink-700')}>{issue.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Action buttons to move issue status */}
      {issue.status !== 'resolved' && (
        <div className="flex gap-2 justify-end">
          {issue.status === 'open' && (
            <Button
              size="sm"
              variant="secondary"
              icon={Play}
              onClick={() => updateStatus('in_progress')}
            >
              Start Remediation
            </Button>
          )}
          {issue.status === 'in_progress' && (
            <Button
              size="sm"
              variant="secondary"
              icon={ShieldAlert}
              onClick={() => updateStatus('under_review')}
            >
              Submit for Verification
            </Button>
          )}
          {(isManager || issue.status === 'under_review') && (
            <Button
              size="sm"
              variant="subtle"
              icon={Check}
              onClick={() => updateStatus('resolved')}
            >
              Mark Resolved
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}
