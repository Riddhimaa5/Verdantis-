/**
 * AuditFormModal.jsx
 * Modal to create or edit a Sustainability Audit record.
 */

import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { useAudit } from '../../store/auditStore'

const SCOPES = [
  'Energy, Waste & Emissions',
  'Supply Chain Compliance',
  'Governance & Ethics Policies',
  'Health & Safety Standard',
  'Water & Biodiversity',
  'Other Scope',
]

const STATUSES = [
  { value: 'scheduled',   label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'completed',    label: 'Completed' },
]

const EMPTY = {
  title: '',
  auditor: '',
  date: '',
  scope: 'Energy, Waste & Emissions',
  status: 'scheduled',
  reportName: '',
}

export default function AuditFormModal({ open, onClose, audit }) {
  const { dispatch } = useAudit()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(audit)

  useEffect(() => {
    setForm(audit ? { ...audit } : EMPTY)
    setErrors({})
  }, [audit, open])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim())   e.title = 'Title is required'
    if (!form.auditor.trim()) e.auditor = 'Auditor is required'
    if (!form.date)           e.date = 'Date is required'
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
      type: isEdit ? 'EDIT_AUDIT' : 'ADD_AUDIT',
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
      title={isEdit ? 'Edit Audit Schedule' : 'New Audit Schedule'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Audit Title <span className="text-danger">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. ISO 14001 surveillance review"
            className={inputCls}
          />
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        </div>

        {/* Scope */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">Scope</label>
          <select
            value={form.scope}
            onChange={(e) => set('scope', e.target.value)}
            className={inputCls}
          >
            {SCOPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Auditor */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Auditor/Assessor Team <span className="text-danger">*</span>
          </label>
          <input
            value={form.auditor}
            onChange={(e) => set('auditor', e.target.value)}
            placeholder="e.g. Legal & Compliance / Ernst & Young"
            className={inputCls}
          />
          {errors.auditor && <p className="text-xs text-danger mt-1">{errors.auditor}</p>}
        </div>

        {/* Date + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">
              Scheduled Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={inputCls}
            />
            {errors.date && <p className="text-xs text-danger mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={inputCls}
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Filename */}
        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1">
            Audit Report Document Name (optional)
          </label>
          <input
            value={form.reportName || ''}
            onChange={(e) => set('reportName', e.target.value)}
            placeholder="e.g. iso-14001-audit.pdf"
            className={inputCls}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1 border-t border-ink-100 mt-1">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {isEdit ? 'Save Changes' : 'Create Audit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
