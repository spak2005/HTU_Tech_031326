import HealthBar from '../HealthBar'
import ChartPanel from '../charts/ChartPanel'
import type { CoreMetric } from '../../data/dashboardMetrics'

interface CoreHealthBarsProps {
  metrics: CoreMetric[]
  reveal: boolean
}

export default function CoreHealthBars({ metrics, reveal }: CoreHealthBarsProps) {
  return (
    <ChartPanel
      title="Core Health Metrics"
      subtitle="Four primary signals powering the weighted AIO score."
    >
      <div className="grid gap-3 lg:grid-cols-2">
        {metrics.map((metric, index) => (
          <HealthBar
            key={metric.key}
            label={metric.label}
            score={metric.score}
            detail={metric.detail}
            isVisible={reveal}
            delayMs={index * 140}
          />
        ))}
      </div>
    </ChartPanel>
  )
}
