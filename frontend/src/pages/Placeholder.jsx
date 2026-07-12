import { Construction } from 'lucide-react'

export default function Placeholder({ name }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
        <Construction size={24} className="text-brand-600" />
      </div>
      <h2 className="font-display font-semibold text-lg text-ink-800">{name} is being built</h2>
      <p className="text-sm text-ink-400 mt-1.5 max-w-sm">
        This page is next up in the build. Check back shortly — the Dashboard is fully wired for now.
      </p>
    </div>
  )
}
