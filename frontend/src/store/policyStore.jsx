/**
 * policyStore.jsx
 * In-memory state for ESG Policies (Governance module).
 * Keeps track of policies, versions, categories, and employee acknowledgements.
 */

import { createContext, useContext, useReducer } from 'react'
import { CURRENT_USER } from './csrStore'

// ─── seed policies ──────────────────────────────────────────────────────────

const SEED_POLICIES = [
  {
    id: 'pol-1',
    title: 'Supplier Code of Conduct v3',
    version: '3.0',
    category: 'Governance',
    summary: 'Defines the environmental, social, and ethical requirements expected of all suppliers and vendors.',
    content: 'All suppliers must comply with local labor laws, implement waste minimization plans, measure Scope 1 and 2 emissions, and enforce non-discrimination policies. Audits will be conducted annually to verify compliance.',
    effectiveDate: '2026-06-15',
    status: 'active', // active | draft | archived
    createdBy: 'emp-1',
  },
  {
    id: 'pol-2',
    title: 'Environmental Sustainability Policy',
    version: '2.1',
    category: 'Environmental',
    summary: 'Corporate guidelines on energy consumption, single-use plastics reduction, and office resource targets.',
    content: 'Establishes a firm commitment to net-zero Scope 1 & 2 emissions by 2030, complete elimination of single-use plastics across all office campuses, and mandates 100% LED lighting and motion sensors by end of FY2026.',
    effectiveDate: '2026-05-01',
    status: 'active',
    createdBy: 'emp-1',
  },
  {
    id: 'pol-3',
    title: 'Whistleblower & Anti-Bribery Policy',
    version: '4.0',
    category: 'Ethics',
    summary: 'Guidelines on reporting corrupt practices and protecting employee identity.',
    content: 'Details our zero-tolerance policy towards bribery, collusion, and corruption. Establishes the independent hotlines, compliance committee structure, and explicit protection criteria against workplace retaliation.',
    effectiveDate: '2026-07-01',
    status: 'active',
    createdBy: 'emp-2',
  },
  {
    id: 'pol-4',
    title: 'Data Privacy & Security Standard',
    version: '1.2',
    category: 'Governance',
    summary: 'Employee requirements for protecting proprietary and user data under GDPR and local acts.',
    content: 'Specifies safe passwords practices, mandatory dual-factor authentication on all tools, client data storage permissions, and data retention deadlines.',
    effectiveDate: '2026-08-15',
    status: 'draft',
    createdBy: 'emp-1',
  },
]

// ─── seed acknowledgements ──────────────────────────────────────────────────

const SEED_ACKNOWLEDGEMENTS = [
  {
    id: 'ack-1',
    policyId: 'pol-1',
    employeeId: 'emp-3', // Arjun Mehta
    employeeName: 'Arjun Mehta',
    employeeDept: 'Manufacturing',
    status: 'acknowledged', // pending | acknowledged
    acknowledgedAt: '2026-06-20T10:15:00Z',
  },
  {
    id: 'ack-2',
    policyId: 'pol-1',
    employeeId: 'emp-4', // Kavya Iyer
    employeeName: 'Kavya Iyer',
    employeeDept: 'R&D',
    status: 'acknowledged',
    acknowledgedAt: '2026-06-18T14:40:00Z',
  },
  {
    id: 'ack-3',
    policyId: 'pol-2',
    employeeId: 'emp-3', // Arjun Mehta
    employeeName: 'Arjun Mehta',
    employeeDept: 'Manufacturing',
    status: 'pending',
    acknowledgedAt: null,
  },
  {
    id: 'ack-4',
    policyId: 'pol-2',
    employeeId: 'emp-current', // Ananya Rao
    employeeName: 'Ananya Rao',
    employeeDept: 'Operations',
    status: 'acknowledged',
    acknowledgedAt: '2026-07-05T09:30:00Z',
  },
]

// ─── reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    // CRUD Policies
    case 'ADD_POLICY': {
      const policy = {
        ...action.payload,
        id: `pol-${Date.now()}`,
        createdBy: CURRENT_USER.id,
        status: action.payload.status ?? 'draft',
      }
      return { ...state, policies: [policy, ...state.policies] }
    }
    case 'EDIT_POLICY': {
      return {
        ...state,
        policies: state.policies.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p,
        ),
      }
    }
    case 'DELETE_POLICY': {
      return {
        ...state,
        policies: state.policies.filter((p) => p.id !== action.payload),
        acknowledgements: state.acknowledgements.filter(
          (ack) => ack.policyId !== action.payload,
        ),
      }
    }

    // Acknowledge Policy (Current User)
    case 'ACKNOWLEDGE_POLICY': {
      const { policyId } = action.payload
      const existingIdx = state.acknowledgements.findIndex(
        (ack) => ack.policyId === policyId && ack.employeeId === CURRENT_USER.id,
      )

      let updatedAcks = [...state.acknowledgements]
      if (existingIdx !== -1) {
        updatedAcks[existingIdx] = {
          ...updatedAcks[existingIdx],
          status: 'acknowledged',
          acknowledgedAt: new Date().toISOString(),
        }
      } else {
        updatedAcks.push({
          id: `ack-${Date.now()}`,
          policyId,
          employeeId: CURRENT_USER.id,
          employeeName: CURRENT_USER.name,
          employeeDept: CURRENT_USER.department,
          status: 'acknowledged',
          acknowledgedAt: new Date().toISOString(),
        })
      }
      return { ...state, acknowledgements: updatedAcks }
    }

    // Initialize blank acknowledgements for an employee if they are added
    case 'INITIALIZE_ACK': {
      const { policyId, employee } = action.payload
      const already = state.acknowledgements.some(
        (a) => a.policyId === policyId && a.employeeId === employee.id,
      )
      if (already) return state
      return {
        ...state,
        acknowledgements: [
          ...state.acknowledgements,
          {
            id: `ack-${Date.now()}`,
            policyId,
            employeeId: employee.id,
            employeeName: employee.name,
            employeeDept: employee.department,
            status: 'pending',
            acknowledgedAt: null,
          },
        ],
      }
    }

    default:
      return state
  }
}

// ─── context ──────────────────────────────────────────────────────────────────

const PolicyContext = createContext(null)

export function PolicyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    policies: SEED_POLICIES,
    acknowledgements: SEED_ACKNOWLEDGEMENTS,
  })

  return (
    <PolicyContext.Provider value={{ state, dispatch }}>
      {children}
    </PolicyContext.Provider>
  )
}

export function usePolicy() {
  const ctx = useContext(PolicyContext)
  if (!ctx) throw new Error('usePolicy must be used inside <PolicyProvider>')
  return ctx
}
