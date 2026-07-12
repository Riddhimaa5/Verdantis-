export default function Section({ eyebrow, title, subtitle, action, children, className = '' }) {
  return (
    <section className={className}>
      {(title || action) && (
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">{eyebrow}</p>
            )}
            {title && <h2 className="font-display font-semibold text-ink-800 text-lg">{title}</h2>}
            {subtitle && <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
