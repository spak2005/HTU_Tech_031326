import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartPanel from '../charts/ChartPanel'
import ChartTooltip from '../charts/ChartTooltip'
import type { PlatformData } from '../../data/dashboardMetrics'

interface PlatformBreakdownChartProps {
  data: PlatformData[]
}

export default function PlatformBreakdownChart({ data }: PlatformBreakdownChartProps) {
  return (
    <ChartPanel
      title="Model Platform Breakdown"
      subtitle="Mention and factual accuracy coverage by model."
    >
      <div className="h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 2 }} barGap={8}>
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.2} />
            <XAxis dataKey="platform" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={34}
              domain={[0, 100]}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              dataKey="mention"
              name="Mention Rate"
              radius={[6, 6, 0, 0]}
              fill="#551138"
              animationDuration={900}
            />
            <Bar
              dataKey="accuracy"
              name="Accuracy Rate"
              radius={[6, 6, 0, 0]}
              fill="#10b981"
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  )
}
