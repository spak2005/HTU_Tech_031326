import { useEffect, useMemo, useState } from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'
import { getScoreBand } from '../../data/dashboardMetrics'

function scoreColor(score: number): string {
  if (score <= 39) return '#ef4444'
  if (score <= 59) return '#f97316'
  if (score <= 79) return '#f59e0b'
  return '#10b981'
}

interface AIOScoreHeroProps {
  score: number
  delta: number
}

export default function AIOScoreHero({ score, delta }: AIOScoreHeroProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [displayDelta, setDisplayDelta] = useState(0)
  const band = getScoreBand(score)

  useEffect(() => {
    const durationMs = 1600
    const start = performance.now()
    let rafId = 0

    const update = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      setDisplayScore(Math.round(score * progress))
      setDisplayDelta(Number((delta * progress).toFixed(1)))
      if (progress < 1) rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [score, delta])

  const radialData = useMemo(() => [{ name: 'AIO', value: displayScore, fill: scoreColor(displayScore) }], [displayScore])

  return (
    <section className="dashboard-panel overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(85,17,56,0.16),_transparent_55%)]" />
      <div className="relative grid gap-4 lg:grid-cols-[240px_1fr] lg:items-center">
        <div className="relative mx-auto h-52 w-full max-w-[220px] lg:h-56 lg:max-w-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={radialData}
              startAngle={210}
              endAngle={-30}
              innerRadius="70%"
              outerRadius="100%"
              barSize={16}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background cornerRadius={10} animationDuration={1200} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black uppercase tracking-[0.2em] text-text-heading lg:text-4xl">AIO</span>
          </div>
        </div>

        <div>
          <div className="flex items-end gap-3">
            <div className="text-5xl font-black tracking-tight text-text-heading lg:text-6xl">{displayScore}</div>
            <span className="pb-2 text-sm text-text">/100</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold uppercase ${band.tone}`}>
              {band.label}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">
              +{displayDelta.toFixed(1)} this week
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm text-text">
            Weighted across visibility, accuracy, sentiment, and coverage. Accuracy gaps and model omission
            continue to suppress final score.
          </p>
        </div>
      </div>
    </section>
  )
}
