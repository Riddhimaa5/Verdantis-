/**
 * Rewards.jsx
 * Reward Catalog and Redemption page at /rewards.
 * Lists items available for redemption using green XP. Deducts XP, reduces stock,
 * and maintains a local audit log of recent redemptions.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Coins, Sparkles, AlertCircle, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react'
import { useGamification } from '../store/gamificationStore'
import Section from '../components/common/Section'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'

export default function Rewards() {
  const { state, redeemReward } = useGamification()
  const [filterCategory, setFilterCategory] = useState('All')
  const [successModalItem, setSuccessModalItem] = useState(null)

  // Current employee details
  const currentUser = state.employees.find((e) => e.id === 'emp-current')
  const userXP = currentUser ? currentUser.xp : 0

  // Category list
  const categories = ['All', 'Eco Actions', 'Merchandise', 'Privileges']

  // Filtered rewards
  const filteredRewards = useMemo(() => {
    let list = [...state.rewards]
    if (filterCategory !== 'All') {
      list = list.filter((r) => r.category === filterCategory)
    }
    return list
  }, [state.rewards, filterCategory])

  // Filtered redemptions log (only for current user)
  const myRedemptions = useMemo(() => {
    return (state.redemptions || []).filter((r) => r.employeeId === 'emp-current')
  }, [state.redemptions])

  function handleRedeem(reward) {
    if (userXP < reward.cost || reward.stock <= 0) return
    redeemReward(reward.id, 'emp-current')
    setSuccessModalItem(reward)
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="rewards-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rewards-grid)" />
          </svg>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 bg-warn/10 border border-warn/20 px-2.5 py-1 rounded-full">
            <Gift size={11} /> Rewards Shop
          </span>
          <h2 className="font-display font-bold text-white text-2xl md:text-[26px] mt-3 leading-tight">
            Green Rewards
          </h2>
          <p className="text-ink-300 text-sm mt-2 leading-relaxed">
            Redeem your hard-earned sustainability XP for physical merchandise, environmental action pledges, or corporate privileges.
          </p>
        </div>

        {/* User Balance Wallet */}
        {currentUser && (
          <div className="relative z-10 shrink-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-5 py-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
              <Coins size={22} />
            </div>
            <div>
              <p className="text-[10px] text-ink-300 uppercase tracking-wider font-semibold">Available Balance</p>
              <p className="font-mono text-xl font-bold text-amber-300">{currentUser.xp.toLocaleString()} <span className="text-xs font-sans font-medium text-white">XP</span></p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Rewards Catalog */}
      <Section
        eyebrow="Shop"
        title="Redemption Catalog"
        subtitle="Choose your reward. Cost will be deducted directly from your total XP balance."
      >
        {/* Category filters */}
        <div className="flex items-center gap-1.5 mb-6 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                filterCategory === c
                  ? 'bg-ink-800 text-white border-ink-800 shadow-sm'
                  : 'border-ink-200 text-ink-500 hover:border-ink-300 hover:text-ink-700 hover:bg-ink-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Catalog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => {
            const hasEnough = userXP >= reward.cost
            const isOutOfStock = reward.stock <= 0
            const canRedeem = hasEnough && !isOutOfStock

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 flex flex-col gap-4 border hover:shadow-card transition-shadow justify-between"
              >
                <div>
                  {/* Category & Stock */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider bg-ink-100 px-2 py-0.5 rounded">
                      {reward.category}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        isOutOfStock ? 'text-danger' : reward.stock <= 5 ? 'text-warn font-semibold' : 'text-ink-400'
                      }`}
                    >
                      {isOutOfStock ? 'Out of stock' : `${reward.stock} units remaining`}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3">
                    <span className="text-4xl shrink-0 filter drop-shadow">{reward.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-ink-800 text-sm leading-snug">{reward.title}</h4>
                      <p className="text-xs text-ink-500 mt-1 leading-relaxed">{reward.description}</p>
                    </div>
                  </div>
                </div>

                {/* Footer price & button */}
                <div className="pt-3 border-t border-ink-100 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-ink-400 font-medium">REDEMPTION COST</span>
                    <span className="font-mono font-bold text-amber-600 text-sm">
                      {reward.cost} <span className="text-[10px] font-sans font-medium text-ink-500">XP</span>
                    </span>
                  </div>

                  {isOutOfStock ? (
                    <Button size="sm" disabled variant="secondary">
                      Sold Out
                    </Button>
                  ) : !hasEnough ? (
                    <div className="flex flex-col items-end gap-1">
                      <Button size="sm" disabled variant="secondary">
                        Redeem
                      </Button>
                      <span className="text-[10px] text-danger font-medium flex items-center gap-0.5">
                        <AlertCircle size={9} /> Needs {reward.cost - userXP} more XP
                      </span>
                    </div>
                  ) : (
                    <Button size="sm" icon={ShoppingBag} onClick={() => handleRedeem(reward)}>
                      Redeem
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* Redemption History */}
      <Section
        eyebrow="Activity"
        title="Redemption History"
        subtitle="Tracking log of your claimed vouchers and rewards."
      >
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50 flex items-center justify-between text-xs font-semibold text-ink-500 uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <Clock size={13} />
              <span>Claimed Reward</span>
            </div>
            <div className="flex items-center gap-12 text-right">
              <span className="w-20">Cost</span>
              <span className="w-36">Redeemed At</span>
            </div>
          </div>

          <div className="divide-y divide-ink-100">
            {myRedemptions.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center text-ink-400">
                <ShoppingBag size={24} className="mb-2 opacity-40" />
                <p className="text-sm font-medium">No redemptions logged yet.</p>
                <p className="text-xs mt-0.5">Your claimed rewards will show up here.</p>
              </div>
            ) : (
              myRedemptions.map((red) => (
                <div key={red.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-ink-50/20 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{red.rewardIcon}</span>
                    <span className="text-xs font-medium text-ink-800 truncate">{red.rewardTitle}</span>
                  </div>

                  <div className="flex items-center gap-12 text-right shrink-0">
                    <span className="w-20 font-mono text-xs font-semibold text-ink-600">
                      -{red.cost} XP
                    </span>
                    <span className="w-36 text-xs text-ink-400">
                      {new Date(red.redeemedAt).toLocaleDateString()} · {new Date(red.redeemedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      {/* Success Modal Confirmation */}
      <Modal
        open={Boolean(successModalItem)}
        onClose={() => setSuccessModalItem(null)}
        title="Redemption Confirmed"
      >
        {successModalItem && (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <span className="text-6xl filter drop-shadow-md animate-bounce">{successModalItem.icon}</span>
            <div>
              <h4 className="font-display font-bold text-ink-800 text-lg">Redeemed Successfully!</h4>
              <p className="text-xs text-ink-400 mt-1">Claimed: <span className="font-semibold text-ink-700">{successModalItem.title}</span></p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-700 font-semibold bg-brand-50 rounded-lg px-3 py-2 border border-brand-100 max-w-xs">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Deducted {successModalItem.cost} XP from your balance.</span>
            </div>
            <p className="text-xs text-ink-400 mt-1 leading-relaxed max-w-sm">
              A voucher code and receipt details have been sent to your registered work email inbox.
            </p>
            <button
              onClick={() => setSuccessModalItem(null)}
              className="w-full mt-4 bg-ink-800 hover:bg-ink-900 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
