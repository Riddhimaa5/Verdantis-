import { useState } from 'react'
import axios from 'axios'
import { BarChart, Play, Loader2 } from 'lucide-react'

export default function Simulator() {
  const [inputs, setInputs] = useState({
    electricityConsumption: 12000,
    fuelConsumption: 2500,
    csrParticipation: 45,
    compliancePercentage: 60
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/ai/simulate', inputs, {
        withCredentials: true
      })
      if (response.data.success) {
        setResult(response.data.data)
      }
    } catch (error) {
      console.error("Simulation failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-100 rounded-xl">
          <BarChart className="w-6 h-6 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">ESG Simulator</h1>
          <p className="text-ink-500">Test how different initiatives affect your ESG scores</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-ink-100 shadow-sm">
          <h2 className="font-semibold text-lg mb-6">Input Scenarios</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-ink-700 mb-2">
                Electricity Consumption (kWh)
                <span className="text-brand-600">{inputs.electricityConsumption.toLocaleString()}</span>
              </label>
              <input 
                type="range" min="0" max="50000" step="500"
                value={inputs.electricityConsumption}
                onChange={(e) => setInputs({...inputs, electricityConsumption: Number(e.target.value)})}
                className="w-full accent-brand-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-ink-700 mb-2">
                Fuel Consumption (Liters)
                <span className="text-brand-600">{inputs.fuelConsumption.toLocaleString()}</span>
              </label>
              <input 
                type="range" min="0" max="10000" step="100"
                value={inputs.fuelConsumption}
                onChange={(e) => setInputs({...inputs, fuelConsumption: Number(e.target.value)})}
                className="w-full accent-brand-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-ink-700 mb-2">
                CSR Participation (%)
                <span className="text-brand-600">{inputs.csrParticipation}%</span>
              </label>
              <input 
                type="range" min="0" max="100" step="1"
                value={inputs.csrParticipation}
                onChange={(e) => setInputs({...inputs, csrParticipation: Number(e.target.value)})}
                className="w-full accent-brand-600"
              />
            </div>
            
            <div>
              <label className="flex justify-between text-sm font-medium text-ink-700 mb-2">
                Compliance Readiness (%)
                <span className="text-brand-600">{inputs.compliancePercentage}%</span>
              </label>
              <input 
                type="range" min="0" max="100" step="1"
                value={inputs.compliancePercentage}
                onChange={(e) => setInputs({...inputs, compliancePercentage: Number(e.target.value)})}
                className="w-full accent-brand-600"
              />
            </div>

            <button 
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              Run Simulation
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-ink-100 shadow-sm flex flex-col">
          <h2 className="font-semibold text-lg mb-6">Simulation Results</h2>
          
          {result ? (
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="text-center mb-4">
                <div className="text-6xl font-bold text-brand-600 mb-2">{result.overallScore}</div>
                <div className="text-sm font-medium text-ink-500 uppercase tracking-wide">Projected Overall Score</div>
                <div className="mt-3 inline-block px-4 py-1.5 bg-brand-50 text-brand-700 rounded-full font-medium">
                  Rating: {result.rating}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 border-t border-ink-100 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ink-900">{result.environmentalScore}</div>
                  <div className="text-xs text-ink-500 mt-1">Environment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ink-900">{result.socialScore}</div>
                  <div className="text-xs text-ink-500 mt-1">Social</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ink-900">{result.governanceScore}</div>
                  <div className="text-xs text-ink-500 mt-1">Governance</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-ink-400 text-sm">
              Run a simulation to see projected scores
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
