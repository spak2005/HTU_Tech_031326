import { useEffect, useState } from 'react'

interface RevealState {
  hero: boolean
  core: boolean
  trend: boolean
  diagnostics: boolean
  platform: boolean
  narrative: boolean
}

const REVEAL_TIMINGS: Record<keyof RevealState, number> = {
  hero: 140,
  core: 380,
  trend: 620,
  diagnostics: 860,
  platform: 1080,
  narrative: 1280,
}

const INITIAL_REVEAL: RevealState = {
  hero: false,
  core: false,
  trend: false,
  diagnostics: false,
  platform: false,
  narrative: false,
}

export default function useDashboardReveal(): RevealState {
  const [reveal, setReveal] = useState<RevealState>(INITIAL_REVEAL)

  useEffect(() => {
    const timeoutIds = (Object.entries(REVEAL_TIMINGS) as [keyof RevealState, number][]).map(([key, delay]) =>
      setTimeout(() => setReveal(prev => ({ ...prev, [key]: true })), delay),
    )
    return () => timeoutIds.forEach(clearTimeout)
  }, [])

  return reveal
}
