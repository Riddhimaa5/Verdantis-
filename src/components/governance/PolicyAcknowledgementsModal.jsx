/**
 * PolicyAcknowledgementsModal.jsx
 * Audit log view for managers to inspect compliance/acknowledgements for a policy.
 * Lists all employees and displays their acceptance status and acceptance date.
 */

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Search, Users } from 'lucide-react'
import Modal from '../common/Modal'
import { usePolicy } from '../../store/policyStore'
import { useGamification } from '../../store/gamificationStore'

const statusBadge = {
  pending: 'bg-red-50 text-danger',
  acknowledged: 'bg-brand-50 text-brand-700',
}

export default function PolicyAcknowledgementsModal({ open, onClose, policy }) {
  const { state } = usePolicy()
  const gamification = useGamification() // To obtain all employees for full coverage check
  const [searchQuery, setSearchQuery] = useState('')

  if (!policy) return null

  // Build compliance list for ALL active employees
  const complianceRecords = gamification.state.employees.map((emp) => {
    const ack = state.acknowledgements.find(
      (a) => a.policyId === policy.id && a.employeeId === emp.id,
    )
    return {
      employeeId: emp.id,
      employeeName: emp.name,
      employeeDept: emp.department,
      status: ack?.status ?? 'pending',
      acknowledgedAt: ack?.acknowledgedAt ?? null,
    }
  })

  // Filter compliance records by search
  const filteredRecords = complianceRecords.filter((rec) =>
    rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Policy Audit Log — ${policy.title}`}
    >
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-2 transition-colors">
          <Search size={14} className="text-ink-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee compliance..."
            className="bg-transparent outline-none text-xs text-ink-700 placeholder:text-ink-400 w-full"
          />
        </div>

        {/* List of employees */}
        <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredRecords.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center text-ink-400">
              <Users size={32} className="mb-2 opacity-40" />
              <p className="text-sm">No employees match this filter.</p>
            </div>
          )}

          {filteredRecords.map((rec) => (
            <div
              key={rec.employeeId}
              className="rounded-xl border border-ink-100 p-3 flex items-center justify-between gap-3 hover:bg-ink-50/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${rec.employeeName.replace(' ', '')}`}
                  alt={rec.employeeName}
                  className="w-8 h-8 rounded-full bg-ink-100 shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-semibold text-ink-800">{rec.employeeName}</p>
                  <p className="text-[10px] text-ink-400">{rec.employeeDept}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                    statusBadge[rec.status]
                  }`}
                >
                  {rec.status === 'acknowledged' ? (
                    <><CheckCircle2 size={10} /> Acknowledged</>
                  ) : (
                    <><AlertCircle size={10} /> Pending</>
                  )}
                </span>
                {rec.acknowledgedAt && (
                  <p className="text-[9px] text-ink-400 mt-1">
                    {new Date(rec.acknowledgedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
