'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative group">
      <svg 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/25 group-focus-within:text-primary/60 transition-colors duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl border border-foreground/5 bg-foreground/[0.02] text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 focus:bg-background/60 backdrop-blur-sm transition-all duration-300"
      />
    </div>
  )
}
