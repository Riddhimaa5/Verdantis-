/**
 * gamificationStore.jsx
 * Central store for the Gamification system.
 * Keeps track of all employee profiles, their XP, unlocked badges, and department.
 * Provides functions to award XP and automatically unlocks badges based on XP thresholds.
 */

import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── badge definitions ────────────────────────────────────────────────────────

export const BADGES = [
  {
    id: 'badge-1',
    name: 'Eco Rookie',
    description: 'Awarded for starting your sustainability journey. Reach 100 XP.',
    threshold: 100,
    icon: '🌱',
    color: 'bg-brand-50 text-brand-700 border-brand-200',
  },
  {
    id: 'badge-2',
    name: 'Green Catalyst',
    description: 'Actively participating in green programs. Reach 500 XP.',
    threshold: 500,
    icon: '⚡',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'badge-3',
    name: 'Carbon Cutter',
    description: 'Demonstrating significant carbon reduction impact. Reach 1500 XP.',
    threshold: 1500,
    icon: '✂️',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    id: 'badge-4',
    name: 'Waste Warrior',
    description: 'Active contribution in audits and resource efficiency. Reach 3000 XP.',
    threshold: 3000,
    icon: '🛡️',
    color: 'bg-social/5 text-social border-social/20',
  },
  {
    id: 'badge-5',
    name: 'Eco Champion',
    description: 'Top-tier leader of corporate sustainability goals. Reach 4500 XP.',
    threshold: 4500,
    icon: '🏆',
    color: 'bg-warn/10 text-warn border-warn/20',
  },
]

// Helper to calculate badges unlocked based on current XP
export function getUnlockedBadges(xp) {
  return BADGES.filter((b) => xp >= b.threshold)
}

// ─── seed rewards ─────────────────────────────────────────────────────────────

const SEED_REWARDS = [
  {
    id: 'rew-1',
    title: 'Plant a Tree in Your Name',
    cost: 150,
    stock: 100,
    icon: '🌳',
    description: 'We will plant a native sapling in the Nashik forest reserve and email you a digital certificate.',
    category: 'Eco Actions',
  },
  {
    id: 'rew-2',
    title: 'Premium Eco Coffee Mug',
    cost: 300,
    stock: 12,
    icon: '☕',
    description: 'Double-walled insulated steel travel mug with a sustainable bamboo sleeve.',
    category: 'Merchandise',
  },
  {
    id: 'rew-3',
    title: 'Personal Carbon Offset (1 Ton)',
    cost: 500,
    stock: 40,
    icon: '🍃',
    description: 'Offset 1 metric ton of CO2 emissions via certified solar/wind power generation projects.',
    category: 'Eco Actions',
  },
  {
    id: 'rew-4',
    title: 'Organic Cotton Tote Bag',
    cost: 200,
    stock: 25,
    icon: '🛍️',
    description: '100% organic cotton canvas tote with Verdantis graphics and reinforced handles.',
    category: 'Merchandise',
  },
  {
    id: 'rew-5',
    title: '1-Day Work From Home Pass',
    cost: 1000,
    stock: 4,
    icon: '🏠',
    description: 'Get an extra WFH day approval outside of your standard hybrid schedule terms.',
    category: 'Privileges',
  },
  {
    id: 'rew-6',
    title: 'Rooftop Canteen VIP Lunch',
    cost: 800,
    stock: 8,
    icon: '🍱',
    description: 'Complimentary gourmet organic meal voucher at the executive rooftop dining hall.',
    category: 'Privileges',
  },
]

// ─── seed employees ──────────────────────────────────────────────────────────

const SEED_EMPLOYEES = [
  {
    id: 'emp-1',
    name: 'Priya Sharma',
    department: 'Operations',
    xp: 4820,
    avatar: 'PriyaSharma',
  },
  {
    id: 'emp-3',
    name: 'Arjun Mehta',
    department: 'Manufacturing',
    xp: 4510,
    avatar: 'ArjunMehta',
  },
  {
    id: 'emp-4',
    name: 'Kavya Iyer',
    department: 'R&D',
    xp: 4225,
    avatar: 'KavyaIyer',
  },
  {
    id: 'emp-5',
    name: 'Rohan Verma',
    department: 'Logistics',
    xp: 3890,
    avatar: 'RohanVerma',
  },
  {
    id: 'emp-6',
    name: 'Sneha Nair',
    department: 'Corporate',
    xp: 3654,
    avatar: 'SnehaNair',
  },
  {
    id: 'emp-current',
    name: 'Ananya Rao',
    department: 'Operations',
    xp: 1200,
    avatar: 'AnanyaRao',
  },
]

// ─── reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'AWARD_XP': {
      const { employeeId, amount } = action.payload
      const updatedEmployees = state.employees.map((emp) => {
        if (emp.id === employeeId) {
          const newXp = emp.xp + amount
          return { ...emp, xp: newXp }
        }
        return emp
      })
      return { ...state, employees: updatedEmployees }
    }
    case 'REDEEM_REWARD': {
      const { rewardId, employeeId } = action.payload
      const reward = state.rewards.find((r) => r.id === rewardId)
      const employee = state.employees.find((e) => e.id === employeeId)

      if (!reward || !employee || employee.xp < reward.cost || reward.stock <= 0) {
        return state
      }

      // Deduct XP
      const updatedEmployees = state.employees.map((emp) =>
        emp.id === employeeId ? { ...emp, xp: emp.xp - reward.cost } : emp,
      )

      // Reduce Stock
      const updatedRewards = state.rewards.map((rew) =>
        rew.id === rewardId ? { ...rew, stock: rew.stock - 1 } : rew,
      )

      // Log redemption record
      const redemption = {
        id: `red-${Date.now()}`,
        rewardId,
        rewardTitle: reward.title,
        rewardIcon: reward.icon,
        cost: reward.cost,
        employeeId,
        redeemedAt: new Date().toISOString(),
      }

      return {
        ...state,
        employees: updatedEmployees,
        rewards: updatedRewards,
        redemptions: [redemption, ...(state.redemptions || [])],
      }
    }
    default:
      return state
  }
}

// ─── context ──────────────────────────────────────────────────────────────────

const GamificationContext = createContext(null)

export function GamificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    employees: SEED_EMPLOYEES,
    rewards: SEED_REWARDS,
    redemptions: [],
  })

  // helper function to award XP directly
  const awardXP = (employeeId, amount) => {
    dispatch({ type: 'AWARD_XP', payload: { employeeId, amount } })
  }

  // helper to redeem reward
  const redeemReward = (rewardId, employeeId) => {
    dispatch({ type: 'REDEEM_REWARD', payload: { rewardId, employeeId } })
  }

  return (
    <GamificationContext.Provider value={{ state, dispatch, awardXP, redeemReward }}>
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const ctx = useContext(GamificationContext)
  if (!ctx) throw new Error('useGamification must be used inside <GamificationProvider>')
  return ctx
}
