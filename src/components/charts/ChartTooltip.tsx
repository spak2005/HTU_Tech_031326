interface TooltipPayloadItem {
  dataKey: string
  name: string
  value: number
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

export default function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-xl shadow-black/10">
      {label ? <p className="text-xs font-semibold uppercase tracking-wide text-text">{label}</p> : null}
      <div className="mt-1 space-y-1">
        {payload.map(item => (
          <div key={item.dataKey} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-text">{item.name}</span>
            <span className="font-semibold text-text-heading">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
