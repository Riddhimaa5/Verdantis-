/**
 * challengeStore.jsx — in-memory state for the Sustainability Challenges module.
 * Swap seed data with API calls when a backend is ready.
 *
 * Challenge lifecycle:  draft → active → under_review → completed | archived
 * Participation lifecycle: in_progress → submitted → approved | rejected
 */

import { createContext, useContext, useReducer } from 'react'

// ─── current user (shared mock — keep in sync with csrStore.jsx) ─────────────
// Change role to 'employee' to test the employee-only view.
export const CURRENT_USER = {
  id: 'emp-current',
  name: 'Ananya Rao',
  department: 'Operations',
  role: 'manager', // 'employee' | 'manager'
}

// ─── seed challenges ──────────────────────────────────────────────────────────

const SEED_CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Zero Waste Desk Challenge',
    category: 'Waste Reduction',
    difficulty: 'easy',
    description:
      'Go completely zero-waste at your workstation for 30 days. No single-use plastics, no disposable coffee cups — track every item you divert from landfill.',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    targetMetric: 'Waste items diverted',
    targetValue: 50,
    unit: 'items',
    xpAwarded: 300,
    status: 'active',
    createdBy: 'emp-1',
  },
  {
    id: 'ch-2',
    title: 'Commute Carbon Cutter',
    category: 'Carbon Reduction',
    difficulty: 'medium',
    description:
      'Replace at least 12 car commutes this month with public transport, cycling, or walking. Log each green commute with a photo or transit receipt.',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    targetMetric: 'Green commute days',
    targetValue: 12,
    unit: 'days',
    xpAwarded: 450,
    status: 'active',
    createdBy: 'emp-1',
  },
  {
    id: 'ch-3',
    title: '30-Day Energy Audit',
    category: 'Energy',
    difficulty: 'hard',
    description:
      'Document your department\'s daily energy usage for 30 days, identify the top 3 wastage points, and submit a written reduction proposal to the EHS team.',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    targetMetric: 'Energy audit score',
    targetValue: 80,
    unit: '/ 100',
    xpAwarded: 700,
    status: 'draft',
    createdBy: 'emp-1',
  },
  {
    id: 'ch-4',
    title: 'Water Conservation Sprint',
    category: 'Water',
    difficulty: 'medium',
    description:
      'Reduce your department\'s measured water consumption by at least 15% versus last month\'s baseline. Submit a before/after meter reading as proof.',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    targetMetric: 'Water reduction',
    targetValue: 15,
    unit: '%',
    xpAwarded: 500,
    status: 'completed',
    createdBy: 'emp-2',
  },
  {
    id: 'ch-5',
    title: 'Supplier Green Scorecard',
    category: 'Supply Chain',
    difficulty: 'hard',
    description:
      'Evaluate 5 key suppliers against the new ESG scorecard template and submit completed reports. Identify at least one improvement action per supplier.',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    targetMetric: 'Suppliers assessed',
    targetValue: 5,
    unit: 'suppliers',
    xpAwarded: 600,
    status: 'active',
    createdBy: 'emp-1',
  },
]

// ─── seed participations ──────────────────────────────────────────────────────

const SEED_PARTICIPATIONS = [
  {
    id: 'cp-1',
    challengeId: 'ch-4',
    employeeId: 'emp-3',
    employeeName: 'Arjun Mehta',
    employeeDept: 'Manufacturing',
    joinedAt: '2026-06-02T09:00:00Z',
    status: 'approved',
    progress: 100,
    proofUrl: null,
    proofName: null,
    note: '',
    approvedBy: 'emp-1',
    xpAwarded: 500,
  },
  {
    id: 'cp-2',
    challengeId: 'ch-1',
    employeeId: 'emp-4',
    employeeName: 'Kavya Iyer',
    employeeDept: 'R&D',
    joinedAt: '2026-07-02T10:00:00Z',
    status: 'in_progress',
    progress: 42,
    proofUrl: null,
    proofName: null,
    note: '',
    approvedBy: null,
    xpAwarded: 0,
  },
  {
    id: 'cp-3',
    challengeId: 'ch-2',
    employeeId: 'emp-5',
    employeeName: 'Rohan Verma',
    employeeDept: 'Logistics',
    joinedAt: '2026-07-03T08:30:00Z',
    status: 'submitted',
    progress: 100,
    proofUrl: null,
    proofName: 'commute-log-july.pdf',
    note: '',
    approvedBy: null,
    xpAwarded: 0,
  },
]

// XP ledger — maps employeeId → XP earned via Challenges
const SEED_XP = {
  'emp-3': 500,
}

// ─── reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    // ── Challenge CRUD ────────────────────────────────────────────────────────
    case 'ADD_CHALLENGE': {
      const challenge = {
        ...action.payload,
        id: `ch-${Date.now()}`,
        createdBy: CURRENT_USER.id,
        status: action.payload.status ?? 'draft',
      }
      return { ...state, challenges: [challenge, ...state.challenges] }
    }
    case 'EDIT_CHALLENGE': {
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c,
        ),
      }
    }
    case 'DELETE_CHALLENGE': {
      return {
        ...state,
        challenges: state.challenges.filter((c) => c.id !== action.payload),
        participations: state.participations.filter(
          (p) => p.challengeId !== action.payload,
        ),
      }
    }

    // ── Join / Leave ──────────────────────────────────────────────────────────
    case 'JOIN_CHALLENGE': {
      const already = state.participations.find(
        (p) =>
          p.challengeId === action.payload.challengeId &&
          p.employeeId === CURRENT_USER.id,
      )
      if (already) return state
      const part = {
        id: `cp-${Date.now()}`,
        challengeId: action.payload.challengeId,
        employeeId: CURRENT_USER.id,
        employeeName: CURRENT_USER.name,
        employeeDept: CURRENT_USER.department,
        joinedAt: new Date().toISOString(),
        status: 'in_progress',
        progress: 0,
        proofUrl: null,
        proofName: null,
        note: '',
        approvedBy: null,
        xpAwarded: 0,
      }
      return { ...state, participations: [...state.participations, part] }
    }
    case 'LEAVE_CHALLENGE': {
      return {
        ...state,
        participations: state.participations.filter(
          (p) =>
            !(
              p.challengeId === action.payload.challengeId &&
              p.employeeId === CURRENT_USER.id &&
              p.status === 'in_progress'
            ),
        ),
      }
    }

    // ── Progress update ───────────────────────────────────────────────────────
    case 'UPDATE_PROGRESS': {
      return {
        ...state,
        participations: state.participations.map((p) =>
          p.id === action.payload.participationId
            ? { ...p, progress: Math.min(100, Math.max(0, action.payload.progress)) }
            : p,
        ),
      }
    }

    // ── Proof upload + submit ─────────────────────────────────────────────────
    case 'UPLOAD_PROOF': {
      return {
        ...state,
        participations: state.participations.map((p) =>
          p.id === action.payload.participationId
            ? {
                ...p,
                proofUrl: action.payload.proofUrl,
                proofName: action.payload.proofName,
              }
            : p,
        ),
      }
    }
    case 'SUBMIT_FOR_REVIEW': {
      return {
        ...state,
        participations: state.participations.map((p) =>
          p.id === action.payload.participationId
            ? { ...p, status: 'submitted' }
            : p,
        ),
      }
    }

    // ── Manager: approve (awards XP) ─────────────────────────────────────────
    case 'APPROVE_PARTICIPATION': {
      const part = state.participations.find(
        (p) => p.id === action.payload.participationId,
      )
      if (!part) return state
      const challenge = state.challenges.find((c) => c.id === part.challengeId)
      const xp = challenge ? challenge.xpAwarded : 0
      const updatedParts = state.participations.map((p) =>
        p.id === action.payload.participationId
          ? { ...p, status: 'approved', approvedBy: CURRENT_USER.id, xpAwarded: xp }
          : p,
      )
      const prevXp = state.xpLedger[part.employeeId] ?? 0
      return {
        ...state,
        participations: updatedParts,
        xpLedger: { ...state.xpLedger, [part.employeeId]: prevXp + xp },
      }
    }

    // ── Manager: reject (with optional note) ─────────────────────────────────
    case 'REJECT_PARTICIPATION': {
      return {
        ...state,
        participations: state.participations.map((p) =>
          p.id === action.payload.participationId
            ? {
                ...p,
                status: 'rejected',
                note: action.payload.note ?? '',
                approvedBy: CURRENT_USER.id,
              }
            : p,
        ),
      }
    }

    default:
      return state
  }
}

// ─── context + provider ───────────────────────────────────────────────────────

const ChallengeContext = createContext(null)

export function ChallengeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    challenges: SEED_CHALLENGES,
    participations: SEED_PARTICIPATIONS,
    xpLedger: SEED_XP,
  })

  return (
    <ChallengeContext.Provider value={{ state, dispatch }}>
      {children}
    </ChallengeContext.Provider>
  )
}

export function useChallenge() {
  const ctx = useContext(ChallengeContext)
  if (!ctx) throw new Error('useChallenge must be used inside <ChallengeProvider>')
  return ctx
}
