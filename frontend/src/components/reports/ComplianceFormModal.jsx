/**
 * ComplianceFormModal.jsx
 * Modal to create or edit a Compliance Issue.
 */

import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { useAudit } from '../../store/auditStore'

const SEVERITIES = ['low', 'medium', 'high', 'critical']
const OWNERS = ['EHS Team', 'Procurement', 'Legal & Compliance', 'Operations', 'Facilities', 'Corporate']
const STATUSES = ['open', 'in_progress', 'under_review', 'resolved']

const EMPTY = {
  title: '',
  description: '',
  auditId: '',
  severity: 'medium',
  owner: 'EHS Team',
  dueDate: '',
  status: 'open',
}

export default function ComplianceFormModal({ open, onClose, issue, initialAuditId }) {
  const { state, dispatch } = useAudit()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(issue)

  useEffect(() => {
    if (issue) {
      setForm({ ...issue })
    } else {
      setForm({ ...EMPTY, auditId: initialAuditId || '' })
    }
    setErrors({})
  }, [issue, open, initialAuditId])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim())       e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.dueDate)            e.dueDate = 'Due date is required'
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
      type: isEdit ? 'EDIT_ISSUE' : 'ADD_ISSUE',
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
      title={isEdit ? 'Edit Compliance Issue' : 'New Compliance Issue'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Issue Title/Finding <span className="text-danger">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Hazardous labels missing in area B"
            className={inputCls}
          />
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Detailed Description <span className="text-danger">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="Describe the failure, risk, or required action..."
            className={inputCls + ' resize-none'}
          />
          {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
        </div>

        {/* Source Audit Link */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Associated Audit Source (optional)
          </label>
          <select
            value={form.auditId || ''}
            onChange={(e) => set('auditId', e.target.value)}
            className={inputCls}
          >
            <option value="">None / Standalone Issue</option>
            {state.audits.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.scope})
              </option>
            ))}
          </select>
        </div>

        {/* Severity + Owner */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Severity</label>
            <select
              value={form.severity}
              onChange={(e) => set('severity', e.target.value)}
              className={inputCls + ' capitalize'}
            >
              {SEVERITIES.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Owner Team</label>
            <select
              value={form.owner}
              onChange={(e) => set('owner', e.target.value)}
              className={inputCls}
            >
              {OWNERS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">
              Due Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
              className={inputCls}
            />
            {errors.dueDate && <p className="text-xs text-danger mt-1">{errors.dueDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={inputCls + ' capitalize'}
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1 border-t border-ink-100 mt-1">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {isEdit ? 'Save Changes' : 'Create Issue'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
