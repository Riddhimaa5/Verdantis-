import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Sprout } from 'lucide-react'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Leaf,
  Calculator,
  HeartHandshake,
  ShieldCheck,
  Trophy,
  BarChart3,
  FileText,
  Users,
  Settings,
} from 'lucide-react'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/environmental', label: 'Environmental', icon: Leaf },
  { to: '/carbon-accounting', label: 'Carbon Accounting', icon: Calculator },
  { to: '/csr', label: 'CSR Activities', icon: HeartHandshake },
  { to: '/governance', label: 'Governance', icon: ShieldCheck },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function MobileSidebar({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-900/40 z-[90] md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-0 left-0 h-screen w-64 bg-white z-[95] md:hidden flex flex-col border-r border-ink-100"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Sprout size={18} className="text-white" />
                </div>
                <p className="font-display font-bold text-ink-800 text-[15px]">Verdantis</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-ink-100">
                <X size={18} className="text-ink-500" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50',
                    )
                  }
                >
                  <item.icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
