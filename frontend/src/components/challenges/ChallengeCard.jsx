/**
 * ChallengeCard.jsx
 * Displays one challenge with:
 *  - Status badge, difficulty pill, category tag
 *  - Participant count, XP reward, date range
 *  - Per-user progress bar + inline progress input
 *  - Proof upload → Submit for Review
 *  - Manager edit / delete / manage buttons
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  Star,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  UploadCloud,
  LogIn,
  LogOut,
  SendHorizonal,
  TrendingUp,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { useChallenge, CURRENT_USER } from '../../store/challengeStore'
import Button from '../common/Button'
import { ProgressBar } from '../common/ProgressCard'

// ─── style maps ───────────────────────────────────────────────────────────────

const categoryColors = {
  'Waste Reduction':  'bg-teal-50 text-teal-700',
  'Carbon Reduction': 'bg-brand-50 text-brand-700',
  Energy:             'bg-amber-50 text-warn',
  Water:              'bg-blue-50 text-governance',
  'Supply Chain':     'bg-violet-50 text-social',
}

const difficultyStyles = {
  easy:   { cls: 'bg-brand-50 text-brand-700',    label: 'Easy' },
  medium: { cls: 'bg-amber-50 text-warn',          label: 'Medium' },
  hard:   { cls: 'bg-red-50 text-danger',          label: 'Hard' },
}

const statusStyles = {
  draft:        'bg-ink-100 text-ink-500',
  active:       'bg-brand-50 text-brand-700',
  under_review: 'bg-amber-50 text-warn',
  completed:    'bg-blue-50 text-governance',
  archived:     'bg-ink-100 text-ink-400',
}

const statusLabels = {
  draft:        'Draft',
  active:       'Active',
  under_review: 'Under Review',
  completed:    'Completed',
  archived:     'Archived',
}

export default function ChallengeCard({ challenge, onEdit, onDelete, onManage }) {
  const { state, dispatch } = useChallenge()
  const [uploading, setUploading] = useState(false)
  const [progressInput, setProgressInput] = useState(null) // null = not editing

  const isManager = CURRENT_USER.role === 'manager'

  // My participation record
  const myPart = state.participations.find(
    (p) => p.challengeId === challenge.id && p.employeeId === CURRENT_USER.id,
  )

  const participantCount = state.participations.filter(
    (p) => p.challengeId === challenge.id && p.status !== 'rejected',
  ).length

  const canJoin =
    !myPart && challenge.status === 'active'

  // ── actions ────────────────────────────────────────────────────────────────

  function handleJoin() {
    dispatch({ type: 'JOIN_CHALLENGE', payload: { challengeId: challenge.id } })
  }

  function handleLeave() {
    dispatch({ type: 'LEAVE_CHALLENGE', payload: { challengeId: challenge.id } })
  }

  function handleProgressSave() {
    if (myPart && progressInput !== null) {
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: { participationId: myPart.id, progress: Number(progressInput) },
      })
    }
    setProgressInput(null)
  }

  function handleProofUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !myPart) return
    setUploading(true)
    setTimeout(() => {
      dispatch({
        type: 'UPLOAD_PROOF',
        payload: {
          participationId: myPart.id,
          proofUrl: URL.createObjectURL(file),
          proofName: file.name,
        },
      })
      setUploading(false)
    }, 800)
  }

  function handleSubmit() {
    if (!myPart) return
    dispatch({ type: 'SUBMIT_FOR_REVIEW', payload: { participationId: myPart.id } })
  }

  // ── status pill for my participation ──────────────────────────────────────

  const myStatusBadge = myPart && {
    in_progress: (
      <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md flex items-center gap-1">
        <TrendingUp size={11} /> In Progress · {myPart.progress}%
      </span>
    ),
    submitted: (
      <span className="text-[11px] font-medium text-warn bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
        <SendHorizonal size={11} /> Submitted — awaiting review
      </span>
    ),
    approved: (
      <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md flex items-center gap-1">
        <CheckCircle2 size={11} /> Approved · +{myPart.xpAwarded} XP
      </span>
    ),
    rejected: (
      <span className="text-[11px] font-medium text-danger bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
        <XCircle size={11} /> Rejected{myPart.note ? `: ${myPart.note}` : ''}
      </span>
    ),
  }[myPart?.status]

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 flex flex-col gap-4 hover:shadow-card transition-shadow"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-md',
              categoryColors[challenge.category] ?? 'bg-ink-100 text-ink-500')}>
              {challenge.category}
            </span>
            <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-md',
              difficultyStyles[challenge.difficulty]?.cls)}>
              {difficultyStyles[challenge.difficulty]?.label}
            </span>
            <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-md',
              statusStyles[challenge.status])}>
              {statusLabels[challenge.status]}
            </span>
          </div>
          <h3 className="font-display font-semibold text-ink-800 text-[15px] leading-snug">
            {challenge.title}
          </h3>
        </div>

        {isManager && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(challenge)}
              className="p-1.5 rounded-md hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Edit challenge"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(challenge.id)}
              className="p-1.5 rounded-md hover:bg-red-50 text-ink-400 hover:text-danger transition-colors"
              aria-label="Delete challenge"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Description ── */}
      <p className="text-sm text-ink-500 leading-relaxed line-clamp-3">
        {challenge.description}
      </p>

      {/* ── Target ── */}
      <div className="flex items-center gap-1.5 text-[12px] text-ink-500 bg-ink-50 rounded-lg px-3 py-2">
        <Zap size={12} className="text-warn shrink-0" />
        <span>Target: <span className="font-semibold text-ink-700">{challenge.targetValue} {challenge.unit}</span> — {challenge.targetMetric}</span>
      </div>

      {/* ── Meta row ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-400">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} /> {challenge.startDate} → {challenge.endDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} /> {participantCount} joined
        </span>
        <span className="flex items-center gap-1.5 text-warn">
          <Star size={12} /> {challenge.xpAwarded} XP
        </span>
      </div>

      {/* ── My progress (when joined) ── */}
      {myPart && myPart.status === 'in_progress' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-500 font-medium">My progress</span>
            <span className="font-mono font-semibold text-ink-700">{myPart.progress}%</span>
          </div>
          <ProgressBar progress={myPart.progress} />

          {/* Inline progress editor */}
          {progressInput === null ? (
            <button
              onClick={() => setProgressInput(myPart.progress)}
              className="text-[11px] text-brand-600 hover:text-brand-700 font-medium text-left w-fit"
            >
              Update progress →
            </button>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min={0}
                max={100}
                value={progressInput}
                onChange={(e) => setProgressInput(e.target.value)}
                className="flex-1 accent-brand-600"
              />
              <span className="text-xs font-mono w-9 text-right text-ink-700">{progressInput}%</span>
              <button
                onClick={handleProgressSave}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 px-2 py-1 rounded-md hover:bg-brand-50 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setProgressInput(null)}
                className="text-xs text-ink-400 hover:text-ink-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Action strip ── */}
      <div className="pt-1 border-t border-ink-100 flex items-center justify-between gap-3 flex-wrap">
        {myPart && <div>{myStatusBadge}</div>}

        <div className="flex items-center gap-2 ml-auto flex-wrap">

          {/* Proof upload — in_progress only */}
          {myPart && myPart.status === 'in_progress' && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleProofUpload}
              />
              <span className={clsx(
                'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors',
                myPart.proofName
                  ? 'border-brand-300 bg-brand-50 text-brand-700'
                  : 'border-ink-200 hover:border-ink-300 text-ink-600 hover:bg-ink-50',
              )}>
                <UploadCloud size={13} />
                {uploading ? 'Uploading…' : myPart.proofName ? 'Proof ✓' : 'Upload Proof'}
              </span>
            </label>
          )}

          {/* Submit for review — needs proof uploaded */}
          {myPart && myPart.status === 'in_progress' && myPart.proofName && (
            <Button size="sm" icon={SendHorizonal} onClick={handleSubmit}>
              Submit
            </Button>
          )}

          {/* Manager: manage participants */}
          {isManager && (
            <Button variant="secondary" size="sm" icon={Users} onClick={() => onManage(challenge)}>
              Manage
            </Button>
          )}

          {/* Join */}
          {canJoin && (
            <Button size="sm" icon={LogIn} onClick={handleJoin}>
              Join
            </Button>
          )}

          {/* Leave — only while in_progress */}
          {myPart && myPart.status === 'in_progress' && (
            <Button variant="secondary" size="sm" icon={LogOut} onClick={handleLeave}>
              Leave
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
