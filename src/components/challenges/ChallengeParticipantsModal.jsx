/**
 * ChallengeParticipantsModal.jsx
 * Manager view — lists participants for a challenge.
 * Shows their progress, proof file, and lets the manager Approve (→ XP) or Reject (with note).
 * Submitted entries are reviewed here; in_progress entries are visible but not yet actionable.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, FileText, Star, Users, TrendingUp } from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { ProgressBar } from '../common/ProgressCard'
import { useChallenge } from '../../store/challengeStore'
import { useGamification } from '../../store/gamificationStore'

const statusBadge = {
  in_progress: 'bg-ink-100 text-ink-500',
  submitted:   'bg-amber-50 text-warn',
  approved:    'bg-brand-50 text-brand-700',
  rejected:    'bg-red-50 text-danger',
}

const statusLabel = {
  in_progress: 'In Progress',
  submitted:   'Submitted',
  approved:    'Approved',
  rejected:    'Rejected',
}

export default function ChallengeParticipantsModal({ open, onClose, challenge }) {
  const { state, dispatch } = useChallenge()
  const { awardXP } = useGamification()
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectNote, setRejectNote]   = useState('')

  if (!challenge) return null

  const parts = state.participations.filter((p) => p.challengeId === challenge.id)

  function handleApprove(partId) {
    dispatch({ type: 'APPROVE_PARTICIPATION', payload: { participationId: partId } })
    const part = state.participations.find((p) => p.id === partId)
    if (part) {
      awardXP(part.employeeId, challenge.xpAwarded)
    }
  }

  function confirmReject() {
    dispatch({
      type: 'REJECT_PARTICIPATION',
      payload: { participationId: rejectingId, note: rejectNote },
    })
    setRejectingId(null)
    setRejectNote('')
  }

  return (
    <Modal
      open={open}
      onClose={() => { setRejectingId(null); onClose() }}
      title={`Participants — ${challenge.title}`}
    >
      <div className="flex flex-col gap-3 max-h-[62vh] overflow-y-auto pr-1">
        {parts.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center text-ink-400">
            <Users size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No participants yet.</p>
          </div>
        )}

        {parts.map((p) => (
          <div key={p.id} className="rounded-xl border border-ink-100 p-3.5 flex flex-col gap-2">

            {/* Employee row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.employeeName.replace(' ', '')}`}
                  alt={p.employeeName}
                  className="w-8 h-8 rounded-full bg-ink-100 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-ink-800">{p.employeeName}</p>
                  <p className="text-[11px] text-ink-400">{p.employeeDept}</p>
                </div>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${statusBadge[p.status]}`}>
                {statusLabel[p.status]}
                {p.status === 'approved' && (
                  <span className="ml-1 inline-flex items-center gap-0.5">
                    · <Star size={10} className="inline" /> {p.xpAwarded} XP
                  </span>
                )}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <TrendingUp size={12} className="text-ink-400 shrink-0" />
              <ProgressBar progress={p.progress} height="h-1.5" />
              <span className="text-[11px] font-mono text-ink-500 w-8 text-right">{p.progress}%</span>
            </div>

            {/* Proof link */}
            {p.proofName && (
              <a
                href={p.proofUrl ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                <FileText size={12} /> {p.proofName}
              </a>
            )}

            {/* Rejection note */}
            {p.status === 'rejected' && p.note && (
              <p className="text-xs text-ink-400 italic">"{p.note}"</p>
            )}

            {/* Approve / Reject — submitted only */}
            {p.status === 'submitted' && rejectingId !== p.id && (
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="subtle" icon={CheckCircle2} onClick={() => handleApprove(p.id)}>
                  Approve & Award XP
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={XCircle}
                  onClick={() => { setRejectingId(p.id); setRejectNote('') }}
                  className="text-danger border-red-200 hover:bg-red-50"
                >
                  Reject
                </Button>
              </div>
            )}

            {/* Inline reject form */}
            <AnimatePresence>
              {rejectingId === p.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-ink-100">
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="Reason for rejection (optional)"
                      rows={2}
                      className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700 outline-none focus:border-brand-300 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={confirmReject}
                        className="bg-danger hover:bg-red-700 text-white border-0"
                      >
                        Confirm Reject
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setRejectingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Modal>
  )
}
