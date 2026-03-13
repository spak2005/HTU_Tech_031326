export const CORE_WEIGHTS: Record<string, number> = {
  visibility: 0.3,
  accuracy: 0.35,
  sentiment: 0.15,
  coverage: 0.2,
}

export interface CoreMetric {
  key: string
  label: string
  score: number
  detail: string
}

export const CORE_METRICS: CoreMetric[] = [
  { key: 'visibility', label: 'Visibility', score: 62, detail: 'Mentioned in 4/5 target models' },
  { key: 'accuracy', label: 'Accuracy', score: 78, detail: 'Most fact checks now align with site data' },
  { key: 'sentiment', label: 'Sentiment', score: 84, detail: 'Strong positive preference language in mentions' },
  { key: 'coverage', label: 'Coverage', score: 66, detail: 'Consistent presence with one notable gap remaining' },
]

export interface DiagnosticMetric {
  key: string
  label: string
  value: number
  direction: 'bad' | 'good' | 'neutral'
  suffix: string
  description: string
  trend: number[]
}

export const DIAGNOSTIC_METRICS: DiagnosticMetric[] = [
  {
    key: 'hallucinationRate',
    label: 'Hallucination Rate',
    value: 14,
    direction: 'bad',
    suffix: '%',
    description: 'Responses with unverifiable or incorrect claims.',
    trend: [26, 23, 20, 18, 16, 14],
  },
  {
    key: 'utmRevenueTracking',
    label: 'UTM Revenue Tracking',
    value: 5,
    direction: 'good',
    suffix: '% MoM',
    description: 'Month-over-month revenue growth from AI-referred traffic.',
    trend: [1.2, 1.8, 2.5, 3.1, 4.0, 5],
  },
  {
    key: 'positionRankScore',
    label: 'Position/Rank Score',
    value: 73,
    direction: 'good',
    suffix: '/100',
    description: 'Brand currently ranks 3rd in its enterprise laptop branch.',
    trend: [58, 61, 64, 67, 70, 73],
  },
  {
    key: 'competitorGapIndex',
    label: 'Competitor Gap Index',
    value: -9,
    direction: 'neutral',
    suffix: ' pts',
    description: 'Difference versus top competitor AIO performance.',
    trend: [-18, -16, -14, -12, -11, -9],
  },
]

export interface TrendPoint {
  week: string
  score: number
}

export const AIO_TREND_SERIES: TrendPoint[] = [
  { week: 'W1', score: 52 },
  { week: 'W2', score: 55 },
  { week: 'W3', score: 58 },
  { week: 'W4', score: 60 },
  { week: 'W5', score: 62 },
  { week: 'W6', score: 65 },
  { week: 'W7', score: 67 },
  { week: 'W8', score: 69 },
]

export interface PlatformData {
  platform: string
  mention: number
  accuracy: number
}

export const PLATFORM_BREAKDOWN: PlatformData[] = [
  { platform: 'ChatGPT', mention: 88, accuracy: 74 },
  { platform: 'Perplexity', mention: 42, accuracy: 39 },
  { platform: 'Gemini', mention: 85, accuracy: 86 },
  { platform: 'Claude', mention: 78, accuracy: 73 },
  { platform: 'Copilot', mention: 47, accuracy: 41 },
]

export interface Issue {
  title: string
  severity: string
  tone: string
}

export const TOP_ISSUES: Issue[] = [
  {
    title: 'Minor pricing drift persists on 1 product page',
    severity: 'High',
    tone: 'border-red-300 bg-red-50 dark:bg-red-950/25 dark:border-red-800',
  },
  {
    title: 'Perplexity and Copilot coverage still trails top competitors',
    severity: 'Medium',
    tone: 'border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800',
  },
  {
    title: '12 product pages missing structured data markup',
    severity: 'Medium',
    tone: 'border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800',
  },
  {
    title: "Feature list outdated on Claude's knowledge base",
    severity: 'Medium',
    tone: 'border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800',
  },
]

export interface Recommendation {
  title: string
  priority: string
  detail: string
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    title: 'Add Schema.org Product markup to 12 pages',
    priority: 'P1',
    detail: 'Improves machine readability and raises AI citation confidence quickly.',
  },
  {
    title: 'Update pricing across third-party retailer listings',
    priority: 'P1',
    detail: 'Reduces cross-platform drift that leads to wrong-price references.',
  },
  {
    title: 'Create FAQ pages targeting AI shopping queries',
    priority: 'P2',
    detail: 'Targets intent-driven prompts that assistants frequently summarize.',
  },
  {
    title: 'Set up MCP server for real-time product data access',
    priority: 'P2',
    detail: 'Gives agents fresh product truth to reduce hallucinations and staleness.',
  },
]

export function computeAioScore(coreMetrics: CoreMetric[] = CORE_METRICS): number {
  const metricMap = Object.fromEntries(coreMetrics.map(metric => [metric.key, metric.score]))
  const weighted =
    metricMap.visibility * CORE_WEIGHTS.visibility +
    metricMap.accuracy * CORE_WEIGHTS.accuracy +
    metricMap.sentiment * CORE_WEIGHTS.sentiment +
    metricMap.coverage * CORE_WEIGHTS.coverage
  return Math.round(weighted)
}

export function getScoreBand(score: number): { label: string; tone: string } {
  if (score <= 39) return { label: 'Critical', tone: 'text-red-500' }
  if (score <= 59) return { label: 'At Risk', tone: 'text-orange-500' }
  if (score <= 79) return { label: 'Improving', tone: 'text-amber-400' }
  return { label: 'Strong', tone: 'text-emerald-500' }
}
