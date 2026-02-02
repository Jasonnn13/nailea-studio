'use client'

import { useState, useRef, useEffect } from 'react'

interface DropdownOption {
  value: string | number
  label: string
}

interface DropdownProps {
  name?: string
  value: string | number
  onChange: (value: string | number) => void
  options: DropdownOption[]
  placeholder?: string
  label?: string
  required?: boolean
}

export function Dropdown({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  required = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const blurTimeoutRef = useRef<number | null>(null)

  const selectedOption = options.find(opt => opt.value === value)
  const displayValue = selectedOption?.label || placeholder

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optValue: string | number) => {
    onChange(optValue)
    setIsOpen(false)
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = null
    }
  }

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm text-foreground/60 mb-2 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 rounded-md border border-accent/20 bg-background/50 text-foreground text-left flex items-center justify-between hover:bg-background/70 transition-colors focus:outline-none"
        >
          <span className={selectedOption ? 'text-foreground' : 'text-foreground/50'}>
            {displayValue}
          </span>
          <svg
            className={`w-5 h-5 text-foreground/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {isOpen && (
          <ul className="absolute z-50 w-full mt-1 rounded-md bg-card border border-accent/20 shadow-lg overflow-y-auto max-h-48">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`w-full text-left px-3 py-2 hover:bg-accent/10 transition-colors ${
                    value === opt.value ? 'bg-accent/20 text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      </div>
    </div>
  )
}
