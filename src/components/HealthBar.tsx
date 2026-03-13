function getBarTone(score: number) {
  if (score <= 40) return { bar: 'bg-red-500', pill: 'bg-red-500/15 text-red-500' }
  if (score <= 60) return { bar: 'bg-orange-500', pill: 'bg-orange-500/15 text-orange-500' }
  if (score <= 80) return { bar: 'bg-amber-400', pill: 'bg-amber-400/20 text-amber-500 dark:text-amber-300' }
  return { bar: 'bg-emerald-500', pill: 'bg-emerald-500/15 text-emerald-500' }
}

interface HealthBarProps {
  label: string
  score: number
  detail?: string
  isVisible: boolean
  delayMs?: number
}

export default function HealthBar({ label, score, detail, isVisible, delayMs = 0 }: HealthBarProps) {
  const tone = getBarTone(score)

  return (
    <div
      className={`rounded-xl border border-border bg-surface p-4 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-text-heading">{label}</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone.pill}`}>{score}/100</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-300/35 dark:bg-slate-700/55">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ${tone.bar}`}
          style={{ width: isVisible ? `${score}%` : '0%' }}
        />
      </div>
      {detail ? <p className="mt-2 text-xs text-text">{detail}</p> : null}
    </div>
  )
}
