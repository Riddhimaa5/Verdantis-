import { useEffect, useState } from 'react'
import AnimatedCounter from './AnimatedCounter'

// Polar helper for building semi-circle arc paths (180deg sweep, left→right)
function describeArc(cx, cy, r, startAngle, endAngle) {
  const polarToCartesian = (angle) => {
    const rad = ((angle - 180) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }
  const start = polarToCartesian(startAngle)
  const end = polarToCartesian(endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

function Arc({ cx, cy, r, score, color, trackColor, strokeWidth, delay }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setProgress(score), delay)
    return () => clearTimeout(t)
  }, [score, delay])

  const circumference = Math.PI * r // half circumference (180deg arc length)
  const offset = circumference * (1 - progress / 100)

  return (
    <>
      <path
        d={describeArc(cx, cy, r, 0, 180)}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={describeArc(cx, cy, r, 0, 180)}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </>
  )
}

/**
 * ESGGauge — Verdantis' signature visual: three nested semi-circle arcs
 * (Environmental / Social / Governance) converging on one overall score.
 * Reused, smaller, on the Environmental & Governance pages.
 */
export default function ESGGauge({ overall, environmental, social, governance, size = 260 }) {
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = size * 0.052

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.58}`}>
        <Arc cx={cx} cy={cy} r={size * 0.46} score={environmental} color="#16A34A" trackColor="#DCFCE7" strokeWidth={strokeWidth} delay={0} />
        <Arc cx={cx} cy={cy} r={size * 0.34} score={social} color="#7C3AED" trackColor="#EDE9FE" strokeWidth={strokeWidth} delay={120} />
        <Arc cx={cx} cy={cy} r={size * 0.22} score={governance} color="#2563EB" trackColor="#DBEAFE" strokeWidth={strokeWidth} delay={240} />
      </svg>
      <div className="-mt-6 flex flex-col items-center">
        <span className="font-mono font-bold text-4xl text-ink-800">
          <AnimatedCounter value={overall} />
        </span>
        <span className="text-xs text-ink-400 font-medium tracking-wide uppercase mt-1">Overall ESG Score</span>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Legend color="#16A34A" label="Environmental" value={environmental} />
        <Legend color="#7C3AED" label="Social" value={social} />
        <Legend color="#2563EB" label="Governance" value={governance} />
      </div>
    </div>
  )
}

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-ink-500">{label}</span>
      <span className="text-xs font-mono font-semibold text-ink-700">{value}</span>
    </div>
  )
}
