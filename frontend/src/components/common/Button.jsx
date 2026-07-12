import clsx from 'clsx'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-ink-50',
  ghost: 'text-ink-600 hover:bg-ink-100',
  subtle: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} strokeWidth={2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} strokeWidth={2} />}
    </button>
  )
}
