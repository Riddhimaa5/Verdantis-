import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

export default function AnimatedCounter({ value, duration = 1.2, decimals = 0, suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    })
    prevValue.current = value
    return () => controls.stop()
  }, [value, duration])

  return (
    <span>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
