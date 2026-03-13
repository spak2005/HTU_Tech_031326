import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { PRODUCT_CATEGORIES, getCategoryScore } from '../data/productMetrics'
import type { ProductCategory } from '../data/productMetrics'
import { getScoreBand } from '../data/dashboardMetrics'

function scoreColor(score: number): string {
  if (score <= 39) return '#ef4444'
  if (score <= 59) return '#f97316'
  if (score <= 79) return '#f59e0b'
  return '#10b981'
}

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = scoreColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-text-heading">{score}</span>
      </div>
    </div>
  )
}

function CategoryCard({
  category,
  index,
  onSelect,
}: {
  category: ProductCategory
  index: number
  onSelect: () => void
}) {
  const score = getCategoryScore(category)
  const band = getScoreBand(score)

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={onSelect}
      className="group relative w-full rounded-2xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:border-purple-500/40 hover:shadow-[0_4px_24px_rgba(147,51,234,0.12)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-alt text-2xl">
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-text-heading">{category.name}</h3>
            <span className={`rounded-full bg-surface-alt px-2 py-0.5 text-[11px] font-semibold uppercase ${band.tone}`}>
              {band.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-text">{category.productCount} products tracked</p>
        </div>
        <ScoreRing score={score} />
        <ChevronRight size={18} className="text-text opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </motion.button>
  )
}

function CategoryDetail({ category, onBack }: { category: ProductCategory; onBack: () => void }) {
  const score = getCategoryScore(category)
  const band = getScoreBand(score)
  const color = scoreColor(score)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text transition-colors hover:text-text-heading"
      >
        <ArrowLeft size={16} />
        All Categories
      </button>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-alt text-3xl">
            {category.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-heading">{category.name}</h2>
            <p className="mt-0.5 text-sm text-text">
              {category.productCount} products &middot; Top model: {category.topModel}
            </p>
          </div>
          <div className="text-center">
            <ScoreRing score={score} size={80} />
            <span className={`mt-1 block text-xs font-semibold uppercase ${band.tone}`}>{band.label}</span>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {category.metrics.map((metric, i) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-text">{metric.label}</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-black text-text-heading">{metric.score}</span>
              <span className="pb-1 text-xs text-text">/100</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-surface-alt overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.score}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: scoreColor(metric.score) }}
              />
            </div>
            <p className="mt-2 text-xs text-text">{metric.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Platform Breakdown */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-lg font-semibold text-text-heading">Platform Breakdown</h3>
        <div className="mt-4 space-y-3">
          {category.platforms.map((p, i) => (
            <motion.div
              key={p.platform}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center gap-4"
            >
              <span className="w-24 text-sm font-medium text-text-heading">{p.platform}</span>
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-text mb-1">
                      <span>Mention</span>
                      <span>{p.mention}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.mention}%` }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                        className="h-full rounded-full bg-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-text mb-1">
                      <span>Accuracy</span>
                      <span>{p.accuracy}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.accuracy}%` }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: scoreColor(p.accuracy) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Issue */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 text-amber-500 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-text-heading">Top Issue</h3>
            <p className="mt-1 text-sm text-text">{category.topIssue}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const DEMO_BASELINE = {
  companyName: 'Dell',
  websiteUrl: 'dell.com',
}

export default function ProductsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)

  const companyName = user?.companyName?.trim() || DEMO_BASELINE.companyName

  const sorted = [...PRODUCT_CATEGORIES].sort((a, b) => getCategoryScore(b) - getCategoryScore(a))
  const avgScore = Math.round(sorted.reduce((sum, c) => sum + getCategoryScore(c), 0) / sorted.length)
  const bestCategory = sorted[0]
  const worstCategory = sorted[sorted.length - 1]

  return (
    <div className="min-h-[calc(100vh-65px)] px-6 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px]">
        <AnimatePresence mode="wait">
          {selectedCategory ? (
            <CategoryDetail
              key={selectedCategory.id}
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -24 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="relative rounded-2xl border border-border bg-surface p-5 lg:p-7">
                <button
                  onClick={() => navigate('/analysis')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-text transition-colors hover:text-text-heading"
                >
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </button>
                <h1 className="mt-3 text-2xl font-bold text-text-heading lg:text-3xl">Product Categories</h1>
                <p className="mt-1 text-sm text-text">
                  AIO scores broken down by category for{' '}
                  <span className="font-semibold text-text-heading">{companyName}</span>
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-text">Average Score</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-black text-text-heading">{avgScore}</span>
                    <span className="pb-1 text-sm text-text">/100</span>
                  </div>
                  <p className="mt-1 text-xs text-text">Across {sorted.length} categories</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Strongest Category</p>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" />
                    <span className="text-lg font-bold text-text-heading">{bestCategory.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-text">Score: {getCategoryScore(bestCategory)}/100</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                  className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-500">Needs Attention</p>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingDown size={20} className="text-red-500" />
                    <span className="text-lg font-bold text-text-heading">{worstCategory.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-text">Score: {getCategoryScore(worstCategory)}/100</p>
                </motion.div>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {sorted.map((category, i) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={i}
                    onSelect={() => setSelectedCategory(category)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
