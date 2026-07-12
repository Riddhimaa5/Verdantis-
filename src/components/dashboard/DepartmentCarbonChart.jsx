import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import ChartCard from '../common/ChartCard'
import { departmentCarbon } from '../../data/mockData'

const colors = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-card border border-ink-100 rounded-lg px-3 py-2 text-xs">
      <p className="text-ink-400 mb-1">{payload[0].payload.department}</p>
      <p className="text-ink-800 font-semibold font-mono">{payload[0].value} t CO₂e</p>
    </div>
  )
}

export default function DepartmentCarbonChart() {
  return (
    <ChartCard title="Department-wise Carbon" subtitle="Emissions by business unit, this quarter">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={departmentCarbon} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke="#F1F5F9" />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="department"
            tick={{ fontSize: 12, fill: '#475569' }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="emissions" radius={[0, 6, 6, 0]} barSize={18} animationDuration={900}>
            {departmentCarbon.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
