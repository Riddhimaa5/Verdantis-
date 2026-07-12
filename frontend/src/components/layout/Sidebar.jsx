import { NavLink, Link } from 'react-router-dom'
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
  ChevronsLeft,
  Sprout,
  Brain,
  MessageSquare,
  BarChart,
  Lightbulb
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Environmental',
    items: [
      { to: '/environmental', label: 'Environmental', icon: Leaf },
      { to: '/carbon-accounting', label: 'Carbon Accounting', icon: Calculator },
    ],
  },
  {
    label: 'Social & Governance',
    items: [
      { to: '/csr', label: 'CSR Activities', icon: HeartHandshake },
      { to: '/governance', label: 'Governance', icon: ShieldCheck },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { to: '/challenges', label: 'Challenges', icon: Trophy },
      { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    ],
  },
  {
    label: 'Organization',
    items: [
      { to: '/reports', label: 'Reports', icon: FileText },
      { to: '/employees', label: 'Employees', icon: Users },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { to: '/ai-advisor', label: 'AI Advisor', icon: Brain },
      { to: '/simulator', label: 'ESG Simulator', icon: BarChart },
      { to: '/ai-report', label: 'AI Report Generator', icon: FileText },
      { to: '/ai-chat', label: 'Chat Assistant', icon: MessageSquare },
    ],
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col h-screen sticky top-0 border-r border-ink-100 bg-white transition-all duration-200 shrink-0',
        collapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <Link to="/" className="flex items-center gap-2.5 px-5 h-16 border-b border-ink-100 shrink-0 hover:bg-ink-50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <Sprout size={18} className="text-white" strokeWidth={2.2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display font-bold text-ink-800 text-[15px] leading-none">Verdantis</p>
            <p className="text-[11px] text-ink-400 mt-1 truncate">Sustainable Enterprises</p>
          </div>
        )}
      </Link>

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2.5 text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors relative',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-600 hover:bg-ink-50 hover:text-ink-800',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-brand-600" />
                      )}
                      <item.icon size={17} strokeWidth={2} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-ink-100 flex flex-col gap-0.5 shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-800',
            )
          }
        >
          <Settings size={17} strokeWidth={2} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-ink-400 hover:bg-ink-50 hover:text-ink-700 transition-colors"
        >
          <ChevronsLeft size={17} className={clsx('transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
