/**
 * csrStore.js — in-memory state for the CSR Activities module.
 * Swap the initial data arrays with API calls when a backend is ready.
 *
 * Roles assumed:
 *   currentUser  — the logged-in employee (Ananya Rao)
 *   manager role — Priya Sharma (id: 'emp-1') can approve/reject
 */

import { createContext, useContext, useReducer } from 'react'

// ─── seed data ────────────────────────────────────────────────────────────────

const SEED_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Riverside Cleanup Drive',
    category: 'Environment',
    description:
      'Join the team to clean up the Riverside bank stretch near our Pune office. Gloves and bags provided.',
    date: '2026-07-20',
    location: 'Pune, Riverside Bank',
    maxParticipants: 30,
    hoursAwarded: 8,
    xpAwarded: 200,
    status: 'active', // active | completed | archived
    createdBy: 'emp-1',
  },
  {
    id: 'act-2',
    title: 'Tree Plantation — Nashik Forest',
    category: 'Environment',
    description:
      'Plant native saplings across a 2-acre patch in Nashik district. Transportation arranged from HQ.',
    date: '2026-07-28',
    location: 'Nashik Forest Reserve',
    maxParticipants: 20,
    hoursAwarded: 6,
    xpAwarded: 150,
    status: 'active',
    createdBy: 'emp-1',
  },
  {
    id: 'act-3',
    title: 'Blood Donation Camp',
    category: 'Health & Wellbeing',
    description:
      'Voluntary blood donation organized in partnership with City Blood Bank. On-site refreshments provided.',
    date: '2026-08-05',
    location: 'HQ — Ground Floor Hall',
    maxParticipants: 50,
    hoursAwarded: 3,
    xpAwarded: 100,
    status: 'active',
    createdBy: 'emp-2',
  },
  {
    id: 'act-4',
    title: 'Rural School Teaching Initiative',
    category: 'Education',
    description:
      'Volunteer to teach STEM subjects for a day at a rural government school in Raigad district.',
    date: '2026-07-15',
    location: 'Raigad District, Maharashtra',
    maxParticipants: 10,
    hoursAwarded: 8,
    xpAwarded: 250,
    status: 'completed',
    createdBy: 'emp-1',
  },
]

const SEED_PARTICIPATIONS = [
  {
    id: 'part-1',
    activityId: 'act-4',
    employeeId: 'emp-3', // Arjun Mehta
    employeeName: 'Arjun Mehta',
    employeeDept: 'Manufacturing',
    joinedAt: '2026-07-10T09:00:00Z',
    status: 'approved', // pending | approved | rejected
    proofUrl: null,
    proofName: null,
    note: '',
    approvedBy: 'emp-1',
    xpAwarded: 250,
  },
  {
    id: 'part-2',
    activityId: 'act-1',
    employeeId: 'emp-4', // Kavya Iyer
    employeeName: 'Kavya Iyer',
    employeeDept: 'R&D',
    joinedAt: '2026-07-11T14:00:00Z',
    status: 'pending',
    proofUrl: null,
    proofName: null,
    note: '',
    approvedBy: null,
    xpAwarded: 0,
  },
]

// XP ledger — maps employeeId → total XP earned via CSR
const SEED_XP = {
  'emp-3': 250,
}

// ─── current user (mock) ──────────────────────────────────────────────────────

export const CURRENT_USER = {
  id: 'emp-current',
  name: 'Ananya Rao',
  department: 'Operations',
  // Change to 'employee' to test the employee-only view (no CRUD, no approval)
  role: 'manager', // 'employee' | 'manager'
}

// ─── reducer ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    // Activity CRUD
    case 'ADD_ACTIVITY': {
      const activity = {
        ...action.payload,
        id: `act-${Date.now()}`,
        createdBy: CURRENT_USER.id,
        status: 'active',
      }
      return { ...state, activities: [activity, ...state.activities] }
    }
    case 'EDIT_ACTIVITY': {
      return {
        ...state,
        activities: state.activities.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a,
        ),
      }
    }
    case 'DELETE_ACTIVITY': {
      return {
        ...state,
        activities: state.activities.filter((a) => a.id !== action.payload),
        participations: state.participations.filter(
          (p) => p.activityId !== action.payload,
        ),
      }
    }

    // Join / leave
    case 'JOIN_ACTIVITY': {
      const already = state.participations.find(
        (p) =>
          p.activityId === action.payload.activityId &&
          p.employeeId === CURRENT_USER.id,
      )
      if (already) return state
      const part = {
        id: `part-${Date.now()}`,
        activityId: action.payload.activityId,
        employeeId: CURRENT_USER.id,
        employeeName: CURRENT_USER.name,
        employeeDept: CURRENT_USER.department,
        joinedAt: new Date().toISOString(),
        status: 'pending',
        proofUrl: null,
        proofName: null,
        note: '',
        approvedBy: null,
        xpAwarded: 0,
      }
      return { ...state, participations: [...state.participations, part] }
    }
    case 'LEAVE_ACTIVITY': {
      return {
        ...state,
        participations: state.participations.filter(
          (p) =>
            !(
              p.activityId === action.payload.activityId &&
              p.employeeId === CURRENT_USER.id &&
              p.status === 'pending'
            ),
        ),
      }
    }

    // Proof upload
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

    // Manager: approve
    case 'APPROVE_PARTICIPATION': {
      const part = state.participations.find(
        (p) => p.id === action.payload.participationId,
      )
      if (!part) return state
      const activity = state.activities.find((a) => a.id === part.activityId)
      const xp = activity ? activity.xpAwarded : 0
      const updatedParts = state.participations.map((p) =>
        p.id === action.payload.participationId
          ? { ...p, status: 'approved', approvedBy: CURRENT_USER.id, xpAwarded: xp }
          : p,
      )
      const prevXp = state.xpLedger[part.employeeId] ?? 0
      const updatedXp = { ...state.xpLedger, [part.employeeId]: prevXp + xp }
      return { ...state, participations: updatedParts, xpLedger: updatedXp }
    }

    // Manager: reject
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

// ─── context ──────────────────────────────────────────────────────────────────

const CSRContext = createContext(null)

export function CSRProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    activities: SEED_ACTIVITIES,
    participations: SEED_PARTICIPATIONS,
    xpLedger: SEED_XP,
  })

  return (
    <CSRContext.Provider value={{ state, dispatch }}>
      {children}
    </CSRContext.Provider>
  )
}

export function useCSR() {
  const ctx = useContext(CSRContext)
  if (!ctx) throw new Error('useCSR must be used inside <CSRProvider>')
  return ctx
}
