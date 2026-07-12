/**
 * PolicyCard.jsx
 * Displays a single policy with:
 *  - Status badge, category pill, version, and effective date.
 *  - Policy summary and a collapsible full-content view.
 *  - Employee acknowledgement action/status display.
 *  - Manager edit/delete/manage controls.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Layers, ShieldCheck, Pencil, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import { usePolicy } from '../../store/policyStore'
import { CURRENT_USER } from '../../store/csrStore'
import Button from '../common/Button'

const categoryColors = {
  Environmental: 'bg-brand-50 text-brand-700',
  Social:        'bg-violet-50 text-social',
  Governance:    'bg-blue-50 text-governance',
  Ethics:        'bg-amber-50 text-warn',
}

const statusBadge = {
  draft:    'bg-ink-100 text-ink-500',
  active:   'bg-brand-50 text-brand-700',
  archived: 'bg-ink-100 text-ink-400',
}

export default function PolicyCard({ policy, onEdit, onDelete, onManage }) {
  const { state, dispatch } = usePolicy()
  const [expanded, setExpanded] = useState(false)
  const isManager = CURRENT_USER.role === 'manager'

  // Get user acknowledgement
  const myAck = state.acknowledgements.find(
    (ack) => ack.policyId === policy.id && ack.employeeId === CURRENT_USER.id,
  )

  const isAcknowledged = myAck?.status === 'acknowledged'

  // Total stats
  const totalAcks = state.acknowledgements.filter(
    (a) => a.policyId === policy.id && a.status === 'acknowledged',
  ).length

  function handleAcknowledge() {
    dispatch({ type: 'ACKNOWLEDGE_POLICY', payload: { policyId: policy.id } })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 flex flex-col gap-4 hover:shadow-card transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-md',
              categoryColors[policy.category] ?? 'bg-ink-100 text-ink-500')}>
              {policy.category}
            </span>
            <span className="text-[11px] font-mono font-medium text-ink-400 bg-ink-100 px-1.5 py-0.5 rounded">
              v{policy.version}
            </span>
            <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-md capitalize',
              statusBadge[policy.status])}>
              {policy.status}
            </span>
          </div>
          <h3 className="font-display font-semibold text-ink-800 text-[15px] leading-snug">
            {policy.title}
          </h3>
        </div>

        {isManager && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(policy)}
              className="p-1.5 rounded-md hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Edit policy"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(policy.id)}
              className="p-1.5 rounded-md hover:bg-red-50 text-ink-400 hover:text-danger transition-colors"
              aria-label="Delete policy"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm text-ink-500 leading-relaxed">
        {policy.summary}
      </p>

      {/* Full Content (Collapsible) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-ink-50 rounded-lg p-3 text-xs text-ink-600 leading-relaxed whitespace-pre-wrap border border-ink-100"
          >
            {policy.content}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta Row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-400">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} /> Effective: {policy.effectiveDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Layers size={12} /> {totalAcks} acknowledgements
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 ml-auto"
        >
          {expanded ? <><EyeOff size={12} /> Hide Details</> : <><Eye size={12} /> View Details</>}
        </button>
      </div>

      {/* Action Strip */}
      <div className="pt-2.5 border-t border-ink-100 flex items-center justify-between gap-3 flex-wrap">
        {/* User's acknowledgement status */}
        {isAcknowledged ? (
          <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 size={11} /> Acknowledged · {new Date(myAck.acknowledgedAt).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-[11px] font-medium text-danger bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertCircle size={11} /> Acknowledgment Required
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Manager view: view stats modal */}
          {isManager && (
            <Button variant="secondary" size="sm" icon={Layers} onClick={() => onManage(policy)}>
              Audit Log
            </Button>
          )}

          {/* User action: acknowledge */}
          {policy.status === 'active' && !isAcknowledged && (
            <Button size="sm" icon={ShieldCheck} onClick={handleAcknowledge}>
              Acknowledge
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
