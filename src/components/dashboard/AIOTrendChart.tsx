import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartPanel from '../charts/ChartPanel'
import ChartTooltip from '../charts/ChartTooltip'
import type { TrendPoint } from '../../data/dashboardMetrics'

interface AIOTrendChartProps {
  series: TrendPoint[]
}

export default function AIOTrendChart({ series }: AIOTrendChartProps) {
  return (
    <ChartPanel
      title="AIO Score Over Time"
      subtitle="8-week deterministic trend after optimization cycles."
    >
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 4, left: -12, bottom: 2 }}>
            <defs>
              <linearGradient id="aioScoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#551138" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#551138" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.18} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              domain={[20, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={32}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#551138', strokeOpacity: 0.35 }} />
            <Area
              type="monotone"
              dataKey="score"
              name="AIO Score"
              stroke="#551138"
              strokeWidth={3}
              fill="url(#aioScoreFill)"
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#551138"
              strokeWidth={2}
              dot={{ r: 3, fill: '#551138' }}
              activeDot={{ r: 6, fill: '#a02468', stroke: '#551138', strokeWidth: 1.5 }}
              animationDuration={1100}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  )
}
