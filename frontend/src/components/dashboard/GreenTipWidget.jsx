import { useState, useEffect } from 'react'
import axios from 'axios'
import { Lightbulb, Loader2 } from 'lucide-react'

export default function GreenTipWidget() {
  const [tip, setTip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ai/green-tip', {
          withCredentials: true
        })
        if (response.data.success) {
          setTip(response.data.data.tip)
        }
      } catch (error) {
        console.error("Failed to fetch green tip", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTip()
  }, [])

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl border border-ink-100 shadow-sm flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-brand-600 shrink-0" />
        <p className="text-sm text-ink-500">Loading AI green tip...</p>
      </div>
    )
  }

  if (!tip) return null

  return (
    <div className="bg-gradient-to-r from-brand-500 to-brand-700 p-4 rounded-xl border border-brand-800 shadow-md flex items-start gap-3">
      <div className="p-2 bg-white/20 rounded-lg shrink-0 mt-0.5">
        <Lightbulb className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1">AI Green Tip of the Day</h4>
        <p className="text-sm text-brand-50 leading-relaxed">{tip}</p>
      </div>
    </div>
  )
}
