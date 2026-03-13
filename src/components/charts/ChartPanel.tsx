import type { ReactNode } from 'react'

interface ChartPanelProps {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
  children: ReactNode
  className?: string
}

export default function ChartPanel({ title, subtitle, rightSlot, children, className = '' }: ChartPanelProps) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 lg:p-6 ${className}`}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-heading lg:text-xl">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-text">{subtitle}</p> : null}
        </div>
        {rightSlot}
      </header>
      {children}
    </section>
  )
}
