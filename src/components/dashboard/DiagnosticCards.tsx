import type { DiagnosticMetric } from '../../data/dashboardMetrics'

function metricTone(metric: DiagnosticMetric): string {
  if (metric.direction === 'bad') return 'text-red-500 bg-red-500/10'
  if (metric.direction === 'good') return 'text-emerald-500 bg-emerald-500/10'
  return 'text-amber-500 bg-amber-500/10'
}

function trendPath(values: number[]): string {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

interface DiagnosticCardsProps {
  diagnostics: DiagnosticMetric[]
}

export default function DiagnosticCards({ diagnostics }: DiagnosticCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {diagnostics.map(metric => (
        <article key={metric.key} className="dashboard-panel">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-text-heading">{metric.label}</h3>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${metricTone(metric)}`}>
              {metric.direction === 'bad' ? 'Needs Work' : metric.direction === 'good' ? 'Healthy' : 'Monitor'}
            </span>
          </div>

          <div className="mt-2 flex items-end gap-1">
            <div className="text-3xl font-bold tracking-tight text-text-heading">{metric.value}</div>
            <span className="pb-1 text-sm text-text">{metric.suffix}</span>
          </div>
          <p className="mt-2 text-sm text-text">{metric.description}</p>

          <div className="mt-4 rounded-lg border border-border bg-surface-alt px-2 py-2">
            <svg viewBox="0 0 100 100" className="h-14 w-full">
              <path
                d={trendPath(metric.trend)}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
                className="text-primary"
              />
            </svg>
          </div>
        </article>
      ))}
    </section>
  )
}
