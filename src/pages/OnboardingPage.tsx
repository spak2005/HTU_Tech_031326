import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import WebsiteViewer from '../components/WebsiteViewer'
import AgentFeed from '../components/AgentFeed'
import ModelPromptRush from '../components/ModelPromptRush'

const AGENT_ORDER = ['scout', 'secretShopper', 'verifier', 'benchmarker', 'analyst']

const AGENTS = [
  { id: 'scout', name: 'Scout', icon: '🔍' },
  { id: 'secretShopper', name: 'Secret Shopper', icon: '🕵️' },
  { id: 'verifier', name: 'Verifier', icon: '⚖️' },
  { id: 'benchmarker', name: 'Benchmarker', icon: '📊' },
  { id: 'analyst', name: 'Analyst', icon: '🧠' },
]

const DEMO_BASELINE = {
  companyName: 'Dell',
  websiteUrl: 'dell.com',
}
const TIMING_MULTIPLIER = 0.35
const MODEL_PHASE_DURATION_MS = 4600

interface FeedEvent {
  agent: string
  delay: number
  line: string
  annotation?: string
}

const FEED_EVENTS: FeedEvent[] = [
  { agent: 'scout', delay: 900, line: '🔍 Scout is analyzing {website}...', annotation: 'scan-line' },
  { agent: 'scout', delay: 700, line: '🔍 Crawling page structure and metadata' },
  { agent: 'scout', delay: 800, line: '🔍 Found 23 product listings', annotation: 'schema-good' },
  { agent: 'scout', delay: 900, line: '🔍 Checking Schema.org markup on product pages' },
  { agent: 'scout', delay: 800, line: '🔍 12 pages missing structured product data', annotation: 'schema-missing' },
  { agent: 'scout', delay: 700, line: '🔍 Pricing data found on 18/23 pages' },
  { agent: 'secretShopper', delay: 1000, line: '🕵️ Secret Shopper querying ChatGPT: "best laptops under $1000"' },
  { agent: 'secretShopper', delay: 700, line: '🕵️ ChatGPT response received — Dell XPS 15 mentioned ✅' },
  { agent: 'secretShopper', delay: 950, line: '🕵️ Secret Shopper querying Perplexity: "best laptops under $1000"' },
  { agent: 'secretShopper', delay: 800, line: '🕵️ Perplexity response — Dell mentioned in related picks ⚠️' },
  { agent: 'secretShopper', delay: 1000, line: '🕵️ Secret Shopper querying Gemini: "best business laptops 2026"' },
  { agent: 'secretShopper', delay: 750, line: '🕵️ Gemini response — Dell Latitude mentioned ✅, accurate ✅' },
  { agent: 'secretShopper', delay: 950, line: '🕵️ Secret Shopper querying Claude: "best laptops under $1000"' },
  { agent: 'secretShopper', delay: 750, line: '🕵️ Claude response — Dell XPS mentioned ✅, outdated feature list ⚠️', annotation: 'outdated-info' },
  { agent: 'verifier', delay: 1100, line: '⚖️ Verifier cross-referencing AI responses with site data...' },
  { agent: 'verifier', delay: 900, line: '⚖️ Pricing drift: ChatGPT says XPS 15 is $579, site says $599 ⚠️', annotation: 'pricing-mismatch' },
  { agent: 'verifier', delay: 900, line: '⚖️ Claude references discontinued "XPS 15 9520" model ⚠️' },
  { agent: 'verifier', delay: 750, line: '⚖️ 1 hallucination detected across 1 platform' },
  { agent: 'benchmarker', delay: 1100, line: '📊 Benchmarker analyzing competitors...' },
  { agent: 'benchmarker', delay: 800, line: '📊 HP: mentioned on 5/5 AI platforms' },
  { agent: 'benchmarker', delay: 700, line: '📊 Lenovo: mentioned on 4/5 AI platforms' },
  { agent: 'benchmarker', delay: 700, line: '📊 Dell: mentioned on 4/5 AI platforms' },
  { agent: 'benchmarker', delay: 900, line: '📊 {company} ranked #3 in enterprise laptop branch' },
  { agent: 'benchmarker', delay: 800, line: '📊 Competitor avg accuracy: 83% | {company} accuracy: 78%' },
  { agent: 'analyst', delay: 1200, line: '🧠 Analyst synthesizing results...' },
  { agent: 'analyst', delay: 800, line: '🧠 AIO Score computed.' },
  { agent: 'analyst', delay: 900, line: '🧠 Analysis complete. Loading dashboard...' },
]

const INITIAL_AGENT_STATES: Record<string, string> = AGENT_ORDER.reduce((acc, id) => {
  acc[id] = 'idle'
  return acc
}, {} as Record<string, string>)

function withPersonalization(line: string, company: string, website: string): string {
  return line.replace('{company}', company).replace('{website}', website)
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, setOnboardingData } = useAuth()
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [stage, setStage] = useState<'form' | 'scan' | 'models'>('form')

  const [visibleCount, setVisibleCount] = useState(0)
  const [activeAnnotations, setActiveAnnotations] = useState<string[]>([])
  const [agentStates, setAgentStates] = useState(INITIAL_AGENT_STATES)

  const resolvedCompany = companyName.trim() || DEMO_BASELINE.companyName
  const resolvedWebsite = websiteUrl.trim() || DEMO_BASELINE.websiteUrl

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setOnboardingData(companyName, websiteUrl)
    setStage('scan')
  }

  // Run scan + model animation, then navigate to dashboard
  useEffect(() => {
    if (stage !== 'scan') return

    const timeoutIds: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0

    FEED_EVENTS.forEach((event, index) => {
      elapsed += Math.round(event.delay * TIMING_MULTIPLIER)
      timeoutIds.push(
        setTimeout(() => {
          setVisibleCount(index + 1)

          const activeAgentIndex = AGENT_ORDER.indexOf(event.agent)
          setAgentStates(prev => {
            const next = { ...prev }
            AGENT_ORDER.forEach((agentId, orderIndex) => {
              if (orderIndex < activeAgentIndex) next[agentId] = 'done'
              else if (orderIndex === activeAgentIndex) next[agentId] = 'active'
              else next[agentId] = 'idle'
            })
            return next
          })

          if (event.annotation && event.annotation !== 'scan-line') {
            setActiveAnnotations(prev =>
              prev.includes(event.annotation!) ? prev : [...prev, event.annotation!],
            )
          }
        }, elapsed),
      )
    })

    timeoutIds.push(
      setTimeout(() => {
        setAgentStates(AGENT_ORDER.reduce((acc, id) => ({ ...acc, [id]: 'done' }), {} as Record<string, string>))
      }, elapsed + 180),
    )

    timeoutIds.push(
      setTimeout(() => {
        setStage('models')
      }, elapsed + 500),
    )

    timeoutIds.push(
      setTimeout(() => {
        navigate('/analysis')
      }, elapsed + 500 + MODEL_PHASE_DURATION_MS),
    )

    return () => timeoutIds.forEach(clearTimeout)
  }, [stage, navigate])

  const visibleEvents = useMemo(
    () =>
      FEED_EVENTS.slice(0, visibleCount).map(event => ({
        ...event,
        renderedLine: withPersonalization(event.line, resolvedCompany, resolvedWebsite),
      })),
    [visibleCount, resolvedCompany, resolvedWebsite],
  )

  // Form stage
  if (stage === 'form') {
    return (
      <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center px-6 py-16 overflow-hidden">
        <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl -top-48 -left-32 dark:opacity-[0.06]" />
        <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-3xl bottom-[-10%] -right-32 dark:opacity-[0.05]" />

        <div className="relative w-full max-w-md" style={{ animation: 'fadeup 0.6s ease-out both' }}>
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-10 shadow-sm">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold shadow-sm shadow-primary/20">
                  2
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full w-1/2 bg-primary rounded-full shadow-sm shadow-primary/30" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-text-heading tracking-tight">
                Tell us about your business
              </h1>
              {user?.email && (
                <p className="mt-2 text-sm text-text">
                  Welcome, <span className="text-text-heading font-medium">{user.email}</span>
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-text-heading mb-2">
                  Company name
                </label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text-heading placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-text-heading mb-2">
                  Website URL
                </label>
                <input
                  id="websiteUrl"
                  type="url"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text-heading placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 cursor-pointer"
              >
                Start Analysis
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Scan + Models animation stages
  return (
    <div className="min-h-[calc(100vh-65px)] px-6 py-6 lg:px-8 lg:py-8">
      <div
        className={`transition-all duration-700 ${
          stage === 'models'
            ? 'opacity-0 -translate-y-4 pointer-events-none absolute inset-x-6 lg:inset-x-8'
            : 'opacity-100 translate-y-0 relative'
        }`}
      >
        <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-3">
            <WebsiteViewer
              websiteUrl={resolvedWebsite}
              companyName={resolvedCompany}
              scanStarted
              activeAnnotations={activeAnnotations}
            />
          </div>
          <div className="lg:col-span-2">
            <AgentFeed agents={AGENTS} agentStates={agentStates} visibleEvents={visibleEvents} />
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${
          stage === 'models'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        {stage === 'models' && <ModelPromptRush companyName={resolvedCompany} />}
      </div>
    </div>
  )
}
