import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-ink-500">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-1.5">
          <span className={i === items.length - 1 ? 'text-ink-800 font-medium' : ''}>{item}</span>
          {i < items.length - 1 && <ChevronRight size={13} className="text-ink-300" />}
        </div>
      ))}
    </div>
  )
}
