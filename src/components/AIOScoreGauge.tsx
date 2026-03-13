import { useEffect, useMemo, useState } from 'react'

interface AIOScoreGaugeProps {
  score?: number
  max?: number
  durationMs?: number
}

export default function AIOScoreGauge({ score = 34, max = 100, durationMs = 2000 }: AIOScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let rafId = 0

    const update = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      setDisplayScore(Math.round(score * progress))
      if (progress < 1) rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [score, durationMs])

  const degrees = useMemo(() => (displayScore / max) * 360, [displayScore, max])

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-surface p-6 text-center lg:p-8">
      <div
        className="mx-auto flex h-52 w-52 items-center justify-center rounded-full p-3"
        style={{
          background: `conic-gradient(rgb(239 68 68) ${degrees}deg, rgba(148, 163, 184, 0.22) ${degrees}deg)`,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-bg">
          <div className="text-5xl font-bold text-red-500">{displayScore}</div>
          <div className="text-sm text-text">/ 100</div>
        </div>
      </div>
      <h2 className="mt-5 text-2xl font-bold text-text-heading">AIO Score</h2>
      <p className="mt-1 text-sm text-text">Your AI Optimization health</p>
    </div>
  )
}
