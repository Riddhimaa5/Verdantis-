/**
 * auditStore.jsx
 * In-memory state for Sustainability Audits and Compliance Issues.
 * Automatically flags issues as Overdue if they are past their due date and not Resolved.
 */

import { createContext, useContext, useReducer } from 'react'

// Current date for overdue logic (July 12, 2026 based on local time)
const TODAY_DATE = '2026-07-12'

// ─── seed audits ─────────────────────────────────────────────────────────────

const SEED_AUDITS = [
  {
    id: 'aud-1',
    title: 'ISO 14001 Environmental Audit',
    auditor: 'EcoVert Certification Ltd',
    date: '2026-07-05',
    scope: 'Energy, Waste & Emissions',
    status: 'completed', // scheduled | in_progress | under_review | completed
    findingsCount: 3,
    reportName: 'iso-14001-audit-report.pdf',
  },
  {
    id: 'aud-2',
    title: 'Supplier ESG Compliance Review',
    auditor: 'Internal Procurement Audit',
    date: '2026-07-29',
    scope: 'Supply Chain Compliance',
    status: 'in_progress',
    findingsCount: 1,
    reportName: 'supplier-esg-initial-log.pdf',
  },
  {
    id: 'aud-3',
    title: 'Annual Governance & Ethics Audit',
    auditor: 'Legal & Risk Committee',
    date: '2026-08-12',
    scope: 'Governance & Ethics Policies',
    status: 'scheduled',
    findingsCount: 0,
    reportName: null,
  },
]

// ─── seed compliance issues ──────────────────────────────────────────────────

const SEED_ISSUES = [
  {
    id: 'iss-1',
    title: 'Hazardous waste labeling missing in Warehouse B',
    description: 'Drums containing chemical waste are missing GHS warnings and storage date tags.',
    auditId: 'aud-1',
    severity: 'critical', // low | medium | high | critical
    owner: 'EHS Team',
    dueDate: '2026-07-10', // Before TODAY_DATE, will be automatically flagged as overdue
    status: 'open', // open | in_progress | under_review | resolved
  },
  {
    id: 'iss-2',
    title: 'Inadequate emergency exit lighting in Section 3',
    description: 'Two backup batteries failed the monthly egress lighting checklist.',
    auditId: 'aud-1',
    severity: 'high',
    owner: 'Facilities',
    dueDate: '2026-07-08',
    status: 'resolved', // Resolved, so will not be flagged as overdue
  },
  {
    id: 'iss-3',
    title: 'Supplier carbon emission metrics reporting pending',
    description: 'Three key tier-1 vendors failed to submit Scope 3 questionnaires for Q2.',
    auditId: 'aud-2',
    severity: 'medium',
    owner: 'Procurement',
    dueDate: '2026-07-25',
    status: 'in_progress',
  },
  {
    id: 'iss-4',
    title: 'Non-compliance with local water discharge limits',
    description: 'Minor pH level variance detected in wastewater runoffs near plant outlet.',
    auditId: 'aud-1',
    severity: 'critical',
    owner: 'EHS Team',
    dueDate: '2026-07-20',
    status: 'open',
  },
]

// Helper to determine if an issue is overdue
export function isIssueOverdue(issue) {
  if (issue.status === 'resolved') return false
  return issue.dueDate < TODAY_DATE
}

// ─── reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    // Audit CRUD
    case 'ADD_AUDIT': {
      const audit = {
        ...action.payload,
        id: `aud-${Date.now()}`,
        findingsCount: Number(action.payload.findingsCount ?? 0),
      }
      return { ...state, audits: [audit, ...state.audits] }
    }
    case 'EDIT_AUDIT': {
      return {
        ...state,
        audits: state.audits.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a,
        ),
      }
    }
    case 'DELETE_AUDIT': {
      return {
        ...state,
        audits: state.audits.filter((a) => a.id !== action.payload),
        issues: state.issues.filter((i) => i.auditId !== action.payload),
      }
    }

    // Issue CRUD
    case 'ADD_ISSUE': {
      const issue = {
        ...action.payload,
        id: `iss-${Date.now()}`,
      }
      // If linked to an audit, increment findingsCount
      const updatedAudits = action.payload.auditId
        ? state.audits.map((a) =>
            a.id === action.payload.auditId ? { ...a, findingsCount: a.findingsCount + 1 } : a,
          )
        : state.audits

      return {
        ...state,
        issues: [issue, ...state.issues],
        audits: updatedAudits,
      }
    }
    case 'EDIT_ISSUE': {
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i,
        ),
      }
    }
    case 'DELETE_ISSUE': {
      const issue = state.issues.find((i) => i.id === action.payload)
      const updatedAudits = issue?.auditId
        ? state.audits.map((a) =>
            a.id === issue.auditId ? { ...a, findingsCount: Math.max(0, a.findingsCount - 1) } : a,
          )
        : state.audits

      return {
        ...state,
        issues: state.issues.filter((i) => i.id !== action.payload),
        audits: updatedAudits,
      }
    }

    // Quick status toggle
    case 'SET_ISSUE_STATUS': {
      const { id, status } = action.payload
      return {
        ...state,
        issues: state.issues.map((i) => (i.id === id ? { ...i, status } : i)),
      }
    }

    default:
      return state
  }
}

// ─── context ──────────────────────────────────────────────────────────────────

const AuditContext = createContext(null)

export function AuditProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    audits: SEED_AUDITS,
    issues: SEED_ISSUES,
  })

  return (
    <AuditContext.Provider value={{ state, dispatch }}>
      {children}
    </AuditContext.Provider>
  )
}

export function useAudit() {
  const ctx = useContext(AuditContext)
  if (!ctx) throw new Error('useAudit must be used inside <AuditProvider>')
  return ctx
}
