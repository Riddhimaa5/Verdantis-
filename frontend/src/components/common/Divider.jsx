export function VDivider({ className = '' }) {
  return <div className={`hidden md:block w-px bg-ink-100 self-stretch ${className}`} />
}

export function HDivider({ className = '' }) {
  return <div className={`h-px bg-ink-100 w-full ${className}`} />
}
