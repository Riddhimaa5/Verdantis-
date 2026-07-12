/**
 * CSRActivityCard.jsx
 * Displays one CSR activity with join/leave, participant count, and proof upload.
 * Used in the activities grid on the CSR page.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  UploadCloud,
  LogIn,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { useCSR, CURRENT_USER } from '../../store/csrStore'
import Button from '../common/Button'

const categoryColors = {
  Environment: 'bg-brand-50 text-brand-700',
  'Health & Wellbeing': 'bg-violet-50 text-social',
  Education: 'bg-blue-50 text-governance',
  Community: 'bg-amber-50 text-warn',
}

const statusBadge = {
  active: 'bg-brand-50 text-brand-700',
  completed: 'bg-ink-100 text-ink-500',
  archived: 'bg-ink-100 text-ink-400',
}

export default function CSRActivityCard({ activity, onEdit, onDelete, onManage }) {
  const { state, dispatch } = useCSR()
  const [uploading, setUploading] = useState(false)

  // participation record for current user on this activity
  const myPart = state.participations.find(
    (p) => p.activityId === activity.id && p.employeeId === CURRENT_USER.id,
  )

  const participantCount = state.participations.filter(
    (p) => p.activityId === activity.id && p.status !== 'rejected',
  ).length

  const isManager = CURRENT_USER.role === 'manager'
  const canJoin =
    !myPart &&
    activity.status === 'active' &&
    participantCount < activity.maxParticipants

  function handleJoin() {
    dispatch({ type: 'JOIN_ACTIVITY', payload: { activityId: activity.id } })
  }

  function handleLeave() {
    dispatch({ type: 'LEAVE_ACTIVITY', payload: { activityId: activity.id } })
  }

  function handleProofUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !myPart) return
    setUploading(true)
    // Simulate a brief async (replace with real upload later)
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

  const partStatusIcon = {
    pending: <span className="text-[11px] font-medium text-warn bg-amber-50 px-2 py-0.5 rounded-md">Pending approval</span>,
    approved: <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={11} /> Approved · +{myPart?.xpAwarded} XP</span>,
    rejected: <span className="text-[11px] font-medium text-danger bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1"><XCircle size={11} /> Rejected{myPart?.note ? `: ${myPart.note}` : ''}</span>,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 flex flex-col gap-4 hover:shadow-card transition-shadow"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={clsx(
                'text-[11px] font-semibold px-2 py-0.5 rounded-md',
                categoryColors[activity.category] ?? 'bg-ink-100 text-ink-500',
              )}
            >
              {activity.category}
            </span>
            <span
              className={clsx(
                'text-[11px] font-medium px-2 py-0.5 rounded-md capitalize',
                statusBadge[activity.status],
              )}
            >
              {activity.status}
            </span>
          </div>
          <h3 className="font-display font-semibold text-ink-800 text-[15px] leading-snug">
            {activity.title}
          </h3>
        </div>

        {/* Edit / delete — only for managers */}
        {isManager && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(activity)}
              className="p-1.5 rounded-md hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Edit activity"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(activity.id)}
              className="p-1.5 rounded-md hover:bg-red-50 text-ink-400 hover:text-danger transition-colors"
              aria-label="Delete activity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-ink-500 leading-relaxed line-clamp-3">
        {activity.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-400">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} /> {activity.date}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} /> {activity.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} />
          {participantCount} / {activity.maxParticipants}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} /> {activity.hoursAwarded}h
        </span>
        <span className="flex items-center gap-1.5 text-warn">
          <Star size={12} /> {activity.xpAwarded} XP
        </span>
      </div>

      {/* Action strip */}
      <div className="pt-1 border-t border-ink-100 flex items-center justify-between gap-3 flex-wrap">
        {/* My participation status */}
        {myPart && <div>{partStatusIcon[myPart.status]}</div>}

        <div className="flex items-center gap-2 ml-auto">
          {/* Proof upload — once joined, not yet approved */}
          {myPart && myPart.status === 'pending' && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleProofUpload}
              />
              <span
                className={clsx(
                  'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors',
                  myPart.proofName
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-ink-200 hover:border-ink-300 text-ink-600 hover:bg-ink-50',
                )}
              >
                <UploadCloud size={13} />
                {uploading ? 'Uploading…' : myPart.proofName ? 'Proof uploaded ✓' : 'Upload Proof'}
              </span>
            </label>
          )}

          {/* Manager: view participants */}
          {isManager && (
            <Button
              variant="secondary"
              size="sm"
              icon={Users}
              onClick={() => onManage(activity)}
            >
              Manage
            </Button>
          )}

          {/* Join / Leave */}
          {!myPart && canJoin && (
            <Button size="sm" icon={LogIn} onClick={handleJoin}>
              Join
            </Button>
          )}
          {myPart && myPart.status === 'pending' && (
            <Button
              variant="secondary"
              size="sm"
              icon={LogOut}
              onClick={handleLeave}
            >
              Leave
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
