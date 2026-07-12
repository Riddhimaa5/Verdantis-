/**
 * CSRActivityFormModal.jsx
 * Create / Edit a CSR activity. Reuses the existing Modal component.
 */

import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { useCSR } from '../../store/csrStore'

const CATEGORIES = ['Environment', 'Health & Wellbeing', 'Education', 'Community']

const EMPTY = {
  title: '',
  category: 'Environment',
  description: '',
  date: '',
  location: '',
  maxParticipants: 20,
  hoursAwarded: 4,
  xpAwarded: 100,
}

export default function CSRActivityFormModal({ open, onClose, activity }) {
  const { dispatch } = useCSR()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const isEdit = Boolean(activity)

  useEffect(() => {
    if (activity) {
      setForm({ ...activity })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [activity, open])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.date) e.date = 'Date is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (Number(form.maxParticipants) < 1) e.maxParticipants = 'Must be ≥ 1'
    if (Number(form.hoursAwarded) < 1) e.hoursAwarded = 'Must be ≥ 1'
    if (Number(form.xpAwarded) < 1) e.xpAwarded = 'Must be ≥ 1'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    const payload = {
      ...form,
      maxParticipants: Number(form.maxParticipants),
      hoursAwarded: Number(form.hoursAwarded),
      xpAwarded: Number(form.xpAwarded),
    }
    if (isEdit) {
      dispatch({ type: 'EDIT_ACTIVITY', payload })
    } else {
      dispatch({ type: 'ADD_ACTIVITY', payload })
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Activity' : 'New CSR Activity'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Activity Title <span className="text-danger">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Riverside Cleanup Drive"
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
          />
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="What will participants do?"
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors resize-none"
          />
          {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
        </div>

        {/* Date + Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">
              Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
            />
            {errors.date && <p className="text-xs text-danger mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">
              Location <span className="text-danger">*</span>
            </label>
            <input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="City / Venue"
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
            />
            {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Max participants + Hours + XP */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Max participants</label>
            <input
              type="number"
              min={1}
              value={form.maxParticipants}
              onChange={(e) => set('maxParticipants', e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
            />
            {errors.maxParticipants && <p className="text-xs text-danger mt-1">{errors.maxParticipants}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Hours awarded</label>
            <input
              type="number"
              min={1}
              value={form.hoursAwarded}
              onChange={(e) => set('hoursAwarded', e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
            />
            {errors.hoursAwarded && <p className="text-xs text-danger mt-1">{errors.hoursAwarded}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">XP awarded</label>
            <input
              type="number"
              min={1}
              value={form.xpAwarded}
              onChange={(e) => set('xpAwarded', e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
            />
            {errors.xpAwarded && <p className="text-xs text-danger mt-1">{errors.xpAwarded}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1 border-t border-ink-100 mt-1">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {isEdit ? 'Save Changes' : 'Create Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
