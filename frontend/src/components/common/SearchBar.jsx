import { Search } from 'lucide-react'

export default function SearchBar({ placeholder = 'Search Verdantis…', className = '' }) {
  return (
    <div
      className={`hidden md:flex items-center gap-2 rounded-lg bg-ink-100/70 border border-transparent focus-within:border-brand-300 focus-within:bg-white px-3 py-2 w-72 transition-colors ${className}`}
    >
      <Search size={16} className="text-ink-400 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-400 w-full"
      />
      <kbd className="text-[10px] font-mono text-ink-400 bg-white border border-ink-200 rounded px-1.5 py-0.5">
        ⌘K
      </kbd>
    </div>
  )
}
