import { useEffect, useState } from 'react'

interface AnnotationRegion {
  id: string
  style: React.CSSProperties
  borderClass: string
  labelClass: string
  label: string
}

const REGION_ANNOTATIONS: AnnotationRegion[] = [
  {
    id: 'schema-good',
    style: { left: '8%', top: '17%', width: '34%', height: '18%' },
    borderClass: 'border-emerald-400',
    labelClass: 'bg-emerald-500/95',
    label: '✅ Schema markup found',
  },
  {
    id: 'schema-missing',
    style: { left: '52%', top: '38%', width: '35%', height: '20%' },
    borderClass: 'border-red-400',
    labelClass: 'bg-red-500/95',
    label: '❌ No structured pricing',
  },
  {
    id: 'outdated-info',
    style: { left: '16%', top: '64%', width: '31%', height: '16%' },
    borderClass: 'border-amber-300',
    labelClass: 'bg-amber-300/95 text-slate-900',
    label: '⚠️ Outdated info',
  },
]

const SCREENSHOT_SRC = '/screenshots/dell-analysis.png'
const LIVE_CHECK_INTERVAL_MS = 420

interface LiveCheck {
  id: string
  style: React.CSSProperties
  label: string
  tone: 'emerald' | 'red' | 'amber' | 'purple'
}

const LIVE_CHECK_FRAMES: LiveCheck[][] = [
  [
    { id: 'a', style: { left: '6%', top: '13%', width: '30%', height: '13%' }, label: 'Checking hero metadata...', tone: 'emerald' },
    { id: 'b', style: { left: '49%', top: '24%', width: '24%', height: '12%' }, label: 'Validating image alt tags...', tone: 'purple' },
  ],
  [
    { id: 'a', style: { left: '20%', top: '28%', width: '26%', height: '14%' }, label: 'Comparing model mentions...', tone: 'purple' },
    { id: 'b', style: { left: '58%', top: '35%', width: '28%', height: '13%' }, label: 'Scanning pricing blocks...', tone: 'red' },
  ],
  [
    { id: 'a', style: { left: '10%', top: '50%', width: '22%', height: '12%' }, label: 'Checking Schema.org fields...', tone: 'emerald' },
    { id: 'b', style: { left: '42%', top: '46%', width: '34%', height: '15%' }, label: 'Cross-checking GPT response...', tone: 'amber' },
  ],
  [
    { id: 'a', style: { left: '63%', top: '16%', width: '24%', height: '12%' }, label: 'Inspecting product card IDs...', tone: 'purple' },
    { id: 'b', style: { left: '18%', top: '67%', width: '31%', height: '13%' }, label: 'Flagging stale feature copy...', tone: 'amber' },
  ],
  [
    { id: 'a', style: { left: '46%', top: '60%', width: '28%', height: '13%' }, label: 'Verifying benchmark visibility...', tone: 'emerald' },
    { id: 'b', style: { left: '8%', top: '34%', width: '25%', height: '12%' }, label: 'Reading structured pricing...', tone: 'red' },
  ],
]

const LIVE_TONE_CLASSES: Record<string, { border: string; label: string }> = {
  emerald: { border: 'border-emerald-400/90', label: 'bg-emerald-500/95 text-white' },
  red: { border: 'border-red-400/90', label: 'bg-red-500/95 text-white' },
  amber: { border: 'border-amber-300/90', label: 'bg-amber-300/95 text-slate-900' },
  purple: { border: 'border-primary/90', label: 'bg-primary/95 text-white' },
}

function RegionOverlay({ annotation, isActive }: { annotation: AnnotationRegion; isActive: boolean }) {
  return (
    <div
      style={annotation.style}
      className={`absolute rounded-lg border-2 ${annotation.borderClass} transition-all duration-500 ${
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div
        className={`absolute -top-9 left-0 whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm ${annotation.labelClass}`}
      >
        {annotation.label}
      </div>
    </div>
  )
}

interface WebsiteViewerProps {
  websiteUrl: string
  companyName: string
  scanStarted: boolean
  activeAnnotations: string[]
}

export default function WebsiteViewer({ websiteUrl, companyName, scanStarted, activeAnnotations }: WebsiteViewerProps) {
  const [useFallbackStage, setUseFallbackStage] = useState(false)
  const [liveFrameIndex, setLiveFrameIndex] = useState(0)
  const isActive = (id: string) => activeAnnotations.includes(id)

  useEffect(() => {
    if (!scanStarted) return undefined
    const intervalId = setInterval(() => {
      setLiveFrameIndex(prev => (prev + 1) % LIVE_CHECK_FRAMES.length)
    }, LIVE_CHECK_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [scanStarted])

  const liveChecks = LIVE_CHECK_FRAMES[liveFrameIndex]

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 lg:p-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-text-heading">Live Website Analysis</h2>
        <p className="text-sm text-text">Inspecting storefront signals for {companyName}</p>
      </header>

      <div className="rounded-xl border border-border bg-surface-alt p-3">
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="ml-2 flex-1 rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-text">
            {websiteUrl}
          </div>
        </div>

        <div className="relative max-h-[64vh] overflow-y-auto rounded-lg border border-border bg-slate-200/70">
          <div className="relative mx-auto w-full max-w-[1200px]">
            {!useFallbackStage ? (
              <img
                src={SCREENSHOT_SRC}
                alt="Website screenshot under analysis"
                className="block w-full h-auto"
                onError={() => setUseFallbackStage(true)}
              />
            ) : (
              <div className="relative h-[1200px] w-full bg-gradient-to-b from-slate-300 to-slate-400 p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_55%)]" />
                <div className="relative z-10 grid grid-cols-3 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="h-36 rounded-lg bg-white/70 shadow-sm" />
                  ))}
                </div>
                <div className="relative z-10 mt-8 text-center text-2xl font-bold tracking-wide text-slate-700">
                  dell.com
                </div>
                <div className="relative z-10 mt-2 text-center text-sm text-slate-700/80">
                  Placeholder screenshot surface for annotation choreography
                </div>
              </div>
            )}

            <div
              className={`pointer-events-none absolute left-0 right-0 h-1 bg-primary/90 shadow-[0_0_22px_rgba(85,17,56,0.95)] ${
                scanStarted ? 'animate-[scanline_2s_ease-out_1_forwards]' : 'opacity-0'
              }`}
            />

            {scanStarted &&
              liveChecks.map(check => {
                const tone = LIVE_TONE_CLASSES[check.tone]
                return (
                  <div
                    key={check.id}
                    style={check.style}
                    className={`pointer-events-none absolute rounded-lg border-2 ${tone.border} transition-all duration-350 ease-out`}
                  >
                    <div
                      className={`absolute -top-9 left-0 whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold shadow-md backdrop-blur-sm ${tone.label}`}
                    >
                      {check.label}
                    </div>
                  </div>
                )
              })}

            {REGION_ANNOTATIONS.map(annotation => (
              <RegionOverlay key={annotation.id} annotation={annotation} isActive={isActive(annotation.id)} />
            ))}

            <div
              className={`absolute left-[56%] top-[58%] rounded-xl border border-red-400/80 bg-slate-950/90 p-4 text-sm text-white shadow-xl ring-1 ring-red-400/40 transition-all duration-500 ${
                isActive('pricing-mismatch') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="text-xs uppercase tracking-wide text-red-300">Pricing mismatch</div>
              <div className="mt-1 font-semibold">
                Site says <span className="text-white">$599</span> | ChatGPT says{' '}
                <span className="text-red-300">$549</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
