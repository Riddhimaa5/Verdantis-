import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import ChartCard from '../common/ChartCard'
import { carbonTrend } from '../../data/mockData'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const actual = payload.find((p) => p.dataKey === 'emissions')?.value
  const target = payload.find((p) => p.dataKey === 'target')?.value
  return (
    <div className="bg-white shadow-card border border-ink-100 rounded-lg px-3 py-2 text-xs">
      <p className="text-ink-400 mb-1">{label} 2026</p>
      <p className="text-ink-800 font-semibold font-mono">{actual?.toLocaleString()} t CO₂e actual</p>
      <p className="text-ink-400 font-mono">{target?.toLocaleString()} t CO₂e target</p>
    </div>
  )
}

export default function CarbonTrendChart() {
  return (
    <ChartCard title="Carbon Trend" subtitle="Actual emissions vs. reduction target">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={carbonTrend} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="emissionsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16A34A" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={44} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#CBD5E1"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="emissions"
            stroke="#16A34A"
            strokeWidth={2.5}
            fill="url(#emissionsFill)"
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
