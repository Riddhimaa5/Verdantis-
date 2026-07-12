/**
 * PolicyFormModal.jsx
 * Modal to create or edit an ESG policy.
 */

import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { usePolicy } from '../../store/policyStore'

const CATEGORIES = ['Environmental', 'Social', 'Governance', 'Ethics']

const EMPTY = {
  title: '',
  version: '1.0',
  category: 'Governance',
  summary: '',
  content: '',
  effectiveDate: '',
  status: 'draft',
}

export default function PolicyFormModal({ open, onClose, policy }) {
  const { dispatch } = usePolicy()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(policy)

  useEffect(() => {
    setForm(policy ? { ...policy } : EMPTY)
    setErrors({})
  }, [policy, open])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim())         e.title = 'Title is required'
    if (!form.version.trim())       e.version = 'Version is required'
    if (!form.summary.trim())       e.summary = 'Summary is required'
    if (!form.content.trim())       e.content = 'Content is required'
    if (!form.effectiveDate)        e.effectiveDate = 'Effective date is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    dispatch({
      type: isEdit ? 'EDIT_POLICY' : 'ADD_POLICY',
      payload: form,
    })
    onClose()
  }

  const inputCls =
    'w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit ESG Policy' : 'New ESG Policy'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Policy Title <span className="text-danger">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Environmental Sustainability Policy"
            className={inputCls}
          />
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        </div>

        {/* Category + Version */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">
              Version <span className="text-danger">*</span>
            </label>
            <input
              value={form.version}
              onChange={(e) => set('version', e.target.value)}
              placeholder="e.g. 1.0"
              className={inputCls}
            />
            {errors.version && <p className="text-xs text-danger mt-1">{errors.version}</p>}
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Brief Summary <span className="text-danger">*</span>
          </label>
          <input
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="One-line summary for overview dashboard"
            className={inputCls}
          />
          {errors.summary && <p className="text-xs text-danger mt-1">{errors.summary}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Full Policy Text <span className="text-danger">*</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            rows={5}
            placeholder="Write full detailed terms of the policy..."
            className={inputCls + ' resize-none'}
          />
          {errors.content && <p className="text-xs text-danger mt-1">{errors.content}</p>}
        </div>

        {/* Effective Date + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">
              Effective Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={form.effectiveDate}
              onChange={(e) => set('effectiveDate', e.target.value)}
              className={inputCls}
            />
            {errors.effectiveDate && <p className="text-xs text-danger mt-1">{errors.effectiveDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1 border-t border-ink-100 mt-1">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {isEdit ? 'Save Changes' : 'Create Policy'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
