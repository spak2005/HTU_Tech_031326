import type { CoreMetric } from './dashboardMetrics'
import { computeAioScore } from './dashboardMetrics'

export interface ProductCategory {
  id: string
  name: string
  icon: string
  productCount: number
  topModel: string
  metrics: CoreMetric[]
  platforms: { platform: string; mention: number; accuracy: number }[]
  topIssue: string
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'laptops',
    name: 'Laptops',
    icon: '💻',
    productCount: 42,
    topModel: 'ChatGPT',
    metrics: [
      { key: 'visibility', label: 'Visibility', score: 74, detail: 'Mentioned in all 5 target models' },
      { key: 'accuracy', label: 'Accuracy', score: 82, detail: 'Specs and pricing largely accurate' },
      { key: 'sentiment', label: 'Sentiment', score: 88, detail: 'Strong recommendation language' },
      { key: 'coverage', label: 'Coverage', score: 71, detail: 'Good coverage across consumer and business lines' },
    ],
    platforms: [
      { platform: 'ChatGPT', mention: 92, accuracy: 84 },
      { platform: 'Perplexity', mention: 68, accuracy: 62 },
      { platform: 'Gemini', mention: 88, accuracy: 90 },
      { platform: 'Claude', mention: 82, accuracy: 78 },
      { platform: 'Copilot', mention: 55, accuracy: 48 },
    ],
    topIssue: 'XPS 15 pricing outdated on 2 models',
  },
  {
    id: 'monitors',
    name: 'Monitors',
    icon: '🖥️',
    productCount: 28,
    topModel: 'Gemini',
    metrics: [
      { key: 'visibility', label: 'Visibility', score: 58, detail: 'Mentioned in 3/5 target models' },
      { key: 'accuracy', label: 'Accuracy', score: 71, detail: 'Some spec inaccuracies on UltraSharp line' },
      { key: 'sentiment', label: 'Sentiment', score: 79, detail: 'Positive but lacks comparison context' },
      { key: 'coverage', label: 'Coverage', score: 54, detail: 'Gaming monitors underrepresented' },
    ],
    platforms: [
      { platform: 'ChatGPT', mention: 72, accuracy: 68 },
      { platform: 'Perplexity', mention: 35, accuracy: 30 },
      { platform: 'Gemini', mention: 80, accuracy: 82 },
      { platform: 'Claude', mention: 65, accuracy: 60 },
      { platform: 'Copilot', mention: 38, accuracy: 32 },
    ],
    topIssue: 'UltraSharp U2723QE specs hallucinated on Claude',
  },
  {
    id: 'servers',
    name: 'Servers & Storage',
    icon: '🗄️',
    productCount: 35,
    topModel: 'Claude',
    metrics: [
      { key: 'visibility', label: 'Visibility', score: 68, detail: 'Strong enterprise model coverage' },
      { key: 'accuracy', label: 'Accuracy', score: 85, detail: 'Technical specs highly accurate' },
      { key: 'sentiment', label: 'Sentiment', score: 82, detail: 'Trusted brand positioning in enterprise' },
      { key: 'coverage', label: 'Coverage', score: 72, detail: 'PowerEdge well-covered, storage gaps remain' },
    ],
    platforms: [
      { platform: 'ChatGPT', mention: 85, accuracy: 80 },
      { platform: 'Perplexity', mention: 52, accuracy: 48 },
      { platform: 'Gemini', mention: 78, accuracy: 82 },
      { platform: 'Claude', mention: 90, accuracy: 88 },
      { platform: 'Copilot', mention: 60, accuracy: 55 },
    ],
    topIssue: 'PowerStore pricing missing from all models',
  },
  {
    id: 'peripherals',
    name: 'Peripherals',
    icon: '🎧',
    productCount: 56,
    topModel: 'ChatGPT',
    metrics: [
      { key: 'visibility', label: 'Visibility', score: 38, detail: 'Only mentioned in 2/5 models' },
      { key: 'accuracy', label: 'Accuracy', score: 52, detail: 'Frequent confusion with third-party products' },
      { key: 'sentiment', label: 'Sentiment', score: 65, detail: 'Neutral mentions, rarely recommended' },
      { key: 'coverage', label: 'Coverage', score: 34, detail: 'Most peripherals completely absent' },
    ],
    platforms: [
      { platform: 'ChatGPT', mention: 48, accuracy: 42 },
      { platform: 'Perplexity', mention: 18, accuracy: 15 },
      { platform: 'Gemini', mention: 40, accuracy: 38 },
      { platform: 'Claude', mention: 32, accuracy: 28 },
      { platform: 'Copilot', mention: 20, accuracy: 16 },
    ],
    topIssue: 'Keyboards and mice not attributed to Dell brand',
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: '🌐',
    productCount: 18,
    topModel: 'Gemini',
    metrics: [
      { key: 'visibility', label: 'Visibility', score: 45, detail: 'Limited visibility outside enterprise models' },
      { key: 'accuracy', label: 'Accuracy', score: 68, detail: 'Specs accurate when mentioned' },
      { key: 'sentiment', label: 'Sentiment', score: 72, detail: 'Positioned well for enterprise use cases' },
      { key: 'coverage', label: 'Coverage', score: 40, detail: 'Only switches covered; routers and APs missing' },
    ],
    platforms: [
      { platform: 'ChatGPT', mention: 55, accuracy: 50 },
      { platform: 'Perplexity', mention: 28, accuracy: 24 },
      { platform: 'Gemini', mention: 62, accuracy: 65 },
      { platform: 'Claude', mention: 50, accuracy: 48 },
      { platform: 'Copilot', mention: 30, accuracy: 25 },
    ],
    topIssue: 'No structured data for networking product pages',
  },
  {
    id: 'software',
    name: 'Software & Services',
    icon: '☁️',
    productCount: 22,
    topModel: 'Claude',
    metrics: [
      { key: 'visibility', label: 'Visibility', score: 52, detail: 'Mentioned in 3/5 models' },
      { key: 'accuracy', label: 'Accuracy', score: 74, detail: 'Service descriptions mostly correct' },
      { key: 'sentiment', label: 'Sentiment', score: 78, detail: 'ProSupport gets strong positive mentions' },
      { key: 'coverage', label: 'Coverage', score: 58, detail: 'APEX and ProSupport covered; others missing' },
    ],
    platforms: [
      { platform: 'ChatGPT', mention: 65, accuracy: 60 },
      { platform: 'Perplexity', mention: 38, accuracy: 35 },
      { platform: 'Gemini', mention: 70, accuracy: 72 },
      { platform: 'Claude', mention: 75, accuracy: 70 },
      { platform: 'Copilot', mention: 42, accuracy: 38 },
    ],
    topIssue: 'APEX Cloud pricing completely absent from AI responses',
  },
]

export function getCategoryScore(category: ProductCategory): number {
  return computeAioScore(category.metrics)
}
