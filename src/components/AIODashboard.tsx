import { Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AIOScoreHero from './dashboard/AIOScoreHero'
import AIOTrendChart from './dashboard/AIOTrendChart'
import CoreHealthBars from './dashboard/CoreHealthBars'
import DiagnosticCards from './dashboard/DiagnosticCards'
import PlatformBreakdownChart from './dashboard/PlatformBreakdownChart'
import useDashboardReveal from './dashboard/useDashboardReveal'
import {
  AIO_TREND_SERIES,
  CORE_METRICS,
  DIAGNOSTIC_METRICS,
  PLATFORM_BREAKDOWN,
  RECOMMENDATIONS,
  TOP_ISSUES,
  computeAioScore,
} from '../data/dashboardMetrics'

interface AIODashboardProps {
  companyName: string
  websiteUrl: string
}

export default function AIODashboard({ companyName, websiteUrl }: AIODashboardProps) {
  const navigate = useNavigate()
  const reveal = useDashboardReveal()
  const aioScore = computeAioScore(CORE_METRICS)

  return (
    <section className="space-y-6">
      <div className="relative rounded-2xl border border-border bg-surface p-5 lg:p-7">
        <div>
          <h1 className="text-2xl font-bold text-text-heading lg:text-3xl">Analysis Dashboard</h1>
          <p className="mt-1 text-sm text-text">
            Results for <span className="font-semibold text-text-heading">{companyName}</span> ({websiteUrl})
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="absolute right-5 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-xl border border-[#551138]/30 bg-[#551138] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(85,17,56,0.3),0_4px_20px_rgba(85,17,56,0.15)] transition-all duration-200 hover:bg-[#7a1a52] hover:shadow-[0_4px_16px_rgba(85,17,56,0.4),0_8px_32px_rgba(85,17,56,0.2)] hover:-translate-y-[calc(50%+1px)] active:scale-[0.98]"
        >
          <Package size={16} />
          Products
        </button>
      </div>

      <div
        className={`transition-all duration-500 ${
          reveal.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <AIOScoreHero score={aioScore} delta={2.8} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div
          className={`lg:col-span-2 transition-all duration-500 ${
            reveal.core ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <CoreHealthBars metrics={CORE_METRICS} reveal={reveal.core} />
        </div>
        <div
          className={`lg:col-span-3 transition-all duration-500 ${
            reveal.trend ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <AIOTrendChart series={AIO_TREND_SERIES} />
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${
          reveal.diagnostics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <DiagnosticCards diagnostics={DIAGNOSTIC_METRICS} />
      </div>

      <div
        className={`transition-all duration-500 ${
          reveal.platform ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <PlatformBreakdownChart data={PLATFORM_BREAKDOWN} />
      </div>

      <div
        className={`grid gap-6 lg:grid-cols-2 transition-all duration-500 ${
          reveal.narrative ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <section className="dashboard-panel">
          <h2 className="mb-4 text-xl font-semibold text-text-heading">Top Issues</h2>
          <div className="grid gap-3">
            {TOP_ISSUES.map(issue => (
              <article key={issue.title} className={`rounded-xl border p-4 ${issue.tone}`}>
                <div className="text-xs font-semibold uppercase tracking-wide text-text">{issue.severity}</div>
                <div className="mt-1 font-medium text-text-heading">{issue.title}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <h2 className="mb-4 text-xl font-semibold text-text-heading">Recommendations</h2>
          <div className="grid gap-3">
            {RECOMMENDATIONS.map(rec => (
              <article key={rec.title} className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-primary">{rec.priority}</div>
                <div className="mt-1 font-medium text-text-heading">{rec.title}</div>
                <p className="mt-1 text-sm text-text">{rec.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-panel">
        <h2 className="text-lg font-semibold text-text-heading">Scoring Method</h2>
        <p className="mt-1 text-sm text-text">
          AIO score uses deterministic weighted aggregation: Visibility (30%), Accuracy (35%), Sentiment
          (15%), Coverage (20%).
        </p>
        <div className="mt-3 grid gap-2 text-sm text-text lg:grid-cols-2">
          {CORE_METRICS.map(metric => (
            <div key={metric.key} className="rounded-lg border border-border bg-surface-alt px-3 py-2">
              <span className="font-medium text-text-heading">{metric.label}</span>
              <span className="ml-2 text-text">{metric.score}/100</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
