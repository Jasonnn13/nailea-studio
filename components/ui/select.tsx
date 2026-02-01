'use client'

import { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectOption {
  value: string | number
  label: ReactNode
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  icon?: ReactNode
}

export function Select({
  options,
  placeholder,
  icon,
  className = '',
  ...props
}: SelectProps) {
  const baseClasses =
    'w-full px-3 py-3 rounded-lg border border-accent/30 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-md text-foreground font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all hover:border-accent/50'

  const arrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a0aec0' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`

  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
          {icon}
        </div>
      )}
      <select
        className={`${baseClasses} ${icon ? 'pl-10' : ''} ${className}`}
        style={{
          backgroundImage: arrowSvg,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          paddingRight: '2rem'
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
