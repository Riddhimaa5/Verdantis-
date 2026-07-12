import { useState, useEffect } from 'react'
import axios from 'axios'
import { Brain, ArrowRight, Loader2 } from 'lucide-react'

export default function AIAdvisor() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ai/recommendations', {
          withCredentials: true
        })
        if (response.data.success) {
          setRecommendations(response.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch AI recommendations", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-100 rounded-xl">
          <Brain className="w-6 h-6 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">AI Advisor</h1>
          <p className="text-ink-500">Actionable ESG recommendations powered by Gemini</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-ink-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                  rec.priority === 'High' ? 'bg-red-50 text-red-700' :
                  rec.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-green-50 text-green-700'
                }`}>
                  {rec.priority} Priority
                </span>
              </div>
              <h3 className="font-bold text-ink-900 mb-2">{rec.title}</h3>
              <p className="text-sm text-ink-600 flex-1">{rec.detail}</p>
              <button className="mt-4 flex items-center text-sm font-medium text-brand-600 hover:text-brand-700">
                Take Action <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
