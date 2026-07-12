import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import SearchBar from '../common/SearchBar'
import NotificationBell from '../common/NotificationBell'
import MobileSidebar from './MobileSidebar'
import { company } from '../../data/mockData'

const titles = {
  '/dashboard': 'Dashboard',
  '/environmental': 'Environmental',
  '/carbon-accounting': 'Carbon Accounting',
  '/csr': 'CSR Activities',
  '/governance': 'Governance',
  '/challenges': 'Challenges',
  '/leaderboard': 'Leaderboard',
  '/reports': 'Reports',
  '/employees': 'Employees',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
}

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const title = titles[location.pathname] ?? 'Verdantis'

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-ink-100 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-ink-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} className="text-ink-600" />
          </button>
          <div>
            <h1 className="font-display font-semibold text-ink-800 text-[17px] leading-none">{title}</h1>
            <p className="text-xs text-ink-400 mt-1 hidden sm:block">{company.name} · {company.fiscalYear}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <SearchBar />
          <NotificationBell />
          <div className="w-px h-6 bg-ink-200 mx-1 hidden sm:block" />
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-ink-100 transition-colors">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Ananya&backgroundColor=b6e3f4"
              alt="Profile"
              className="w-8 h-8 rounded-full bg-ink-100"
            />
            <span className="text-sm font-medium text-ink-700 hidden lg:block">Ananya Rao</span>
          </button>
        </div>
      </header>
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
