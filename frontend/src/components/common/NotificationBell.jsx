import { useState, useRef, useEffect } from 'react'
import { Bell, Leaf, ShieldCheck, Trophy } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const notifications = [
  { id: 1, icon: Leaf, color: 'text-brand-600 bg-brand-50', text: 'Carbon target for Manufacturing hit 92%', time: '10m ago' },
  { id: 2, icon: ShieldCheck, color: 'text-governance bg-blue-50', text: 'Supplier Code of Conduct v3 published', time: '3h ago' },
  { id: 3, icon: Trophy, color: 'text-warn bg-amber-50', text: 'You climbed to #4 on the leaderboard', time: '1d ago' },
]

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-ink-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={19} className="text-ink-600" strokeWidth={1.8} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-600 ring-2 ring-white" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 card p-2 z-50 origin-top-right"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold text-ink-800">Notifications</p>
              <span className="text-xs text-brand-600 font-medium cursor-pointer">Mark all read</span>
            </div>
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-3 px-2 py-2.5 rounded-lg hover:bg-ink-50 cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.color}`}>
                    <n.icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-ink-700 leading-snug">{n.text}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
