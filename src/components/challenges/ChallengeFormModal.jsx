/**
 * ChallengeFormModal.jsx
 * Create / Edit a challenge. Reuses existing Modal + Button.
 * Managers can set any status including Draft.
 */

import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { useChallenge } from '../../store/challengeStore'

const CATEGORIES = [
  'Carbon Reduction',
  'Waste Reduction',
  'Energy',
  'Water',
  'Supply Chain',
  'Biodiversity',
  'Other',
]

const DIFFICULTIES = [
  { value: 'easy',   label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard',   label: 'Hard' },
]

const STATUSES = [
  { value: 'draft',        label: 'Draft' },
  { value: 'active',       label: 'Active' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'completed',    label: 'Completed' },
  { value: 'archived',     label: 'Archived' },
]

const EMPTY = {
  title: '',
  category: 'Carbon Reduction',
  difficulty: 'medium',
  description: '',
  startDate: '',
  endDate: '',
  targetMetric: '',
  targetValue: 10,
  unit: '',
  xpAwarded: 300,
  status: 'draft',
}

export default function ChallengeFormModal({ open, onClose, challenge }) {
  const { dispatch } = useChallenge()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(challenge)

  useEffect(() => {
    setForm(challenge ? { ...challenge } : EMPTY)
    setErrors({})
  }, [challenge, open])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim())        e.title       = 'Title is required'
    if (!form.description.trim())  e.description = 'Description is required'
    if (!form.startDate)           e.startDate   = 'Start date is required'
    if (!form.endDate)             e.endDate     = 'End date is required'
    if (!form.targetMetric.trim()) e.targetMetric = 'Target metric is required'
    if (!form.unit.trim())         e.unit        = 'Unit is required'
    if (Number(form.targetValue) < 1) e.targetValue = 'Must be ≥ 1'
    if (Number(form.xpAwarded) < 1)   e.xpAwarded  = 'Must be ≥ 1'
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const payload = {
      ...form,
      targetValue: Number(form.targetValue),
      xpAwarded: Number(form.xpAwarded),
    }
    dispatch({ type: isEdit ? 'EDIT_CHALLENGE' : 'ADD_CHALLENGE', payload })
    onClose()
  }

  const field = (label, key, required, content) => (
    <div>
      <label className="block text-xs font-semibold text-ink-600 mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {content}
      {errors[key] && <p className="text-xs text-danger mt-1">{errors[key]}</p>}
    </div>
  )

  const inputCls =
    'w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Challenge' : 'New Challenge'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[72vh] overflow-y-auto pr-1">

        {/* Title */}
        {field('Challenge Title', 'title', true,
          <input value={form.title} onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Zero Waste Desk Challenge" className={inputCls} />
        )}

        {/* Category + Difficulty */}
        <div className="grid grid-cols-2 gap-3">
          {field('Category', 'category', false,
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          )}
          {field('Difficulty', 'difficulty', false,
            <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className={inputCls}>
              {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          )}
        </div>

        {/* Description */}
        {field('Description', 'description', true,
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
            rows={3} placeholder="What must participants do?" className={inputCls + ' resize-none'} />
        )}

        {/* Start + End dates */}
        <div className="grid grid-cols-2 gap-3">
          {field('Start Date', 'startDate', true,
            <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
          )}
          {field('End Date', 'endDate', true,
            <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
          )}
        </div>

        {/* Target metric + value + unit */}
        {field('Target Metric', 'targetMetric', true,
          <input value={form.targetMetric} onChange={(e) => set('targetMetric', e.target.value)}
            placeholder="e.g. Green commute days" className={inputCls} />
        )}
        <div className="grid grid-cols-2 gap-3">
          {field('Target Value', 'targetValue', true,
            <input type="number" min={1} value={form.targetValue}
              onChange={(e) => set('targetValue', e.target.value)} className={inputCls} />
          )}
          {field('Unit', 'unit', true,
            <input value={form.unit} onChange={(e) => set('unit', e.target.value)}
              placeholder="days / items / %" className={inputCls} />
          )}
        </div>

        {/* XP + Status */}
        <div className="grid grid-cols-2 gap-3">
          {field('XP Awarded', 'xpAwarded', true,
            <input type="number" min={1} value={form.xpAwarded}
              onChange={(e) => set('xpAwarded', e.target.value)} className={inputCls} />
          )}
          {field('Status', 'status', false,
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1 border-t border-ink-100 mt-1 sticky bottom-0 bg-white">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{isEdit ? 'Save Changes' : 'Create Challenge'}</Button>
        </div>
      </form>
    </Modal>
  )
}
