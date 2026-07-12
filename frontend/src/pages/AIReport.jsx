import { useState } from 'react'
import axios from 'axios'
import { FileText, Loader2, Download } from 'lucide-react'

export default function AIReport() {
  const [meta, setMeta] = useState({
    companyName: 'Verdantis Corp',
    industry: 'Technology',
    reportingPeriod: 'Q3 2026'
  })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/ai/report', meta, {
        withCredentials: true
      })
      if (response.data.success) {
        setReport(response.data.data)
      }
    } catch (error) {
      console.error("Failed to generate report", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-100 rounded-xl">
          <FileText className="w-6 h-6 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">AI Report Generator</h1>
          <p className="text-ink-500">Generate executive summaries based on your live ESG data</p>
        </div>
      </div>

      {!report ? (
        <div className="bg-white p-8 rounded-2xl border border-ink-100 shadow-sm max-w-2xl mx-auto w-full mt-10">
          <h2 className="font-semibold text-lg mb-6">Report Parameters</h2>
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Company Name</label>
              <input 
                type="text" 
                value={meta.companyName}
                onChange={e => setMeta({...meta, companyName: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Industry</label>
              <input 
                type="text" 
                value={meta.industry}
                onChange={e => setMeta({...meta, industry: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Reporting Period</label>
              <input 
                type="text" 
                value={meta.reportingPeriod}
                onChange={e => setMeta({...meta, reportingPeriod: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors mt-4"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Generating Report...' : 'Generate Executive Report'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-ink-100 shadow-sm prose prose-ink max-w-none">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-ink-100">
            <div>
              <h2 className="text-3xl font-bold text-ink-900 m-0">Executive ESG Report</h2>
              <p className="text-ink-500 mt-2">{meta.companyName} | {meta.industry} | {meta.reportingPeriod}</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-ink-100 text-ink-700 rounded-lg text-sm font-medium hover:bg-ink-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-brand-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-brand-700">{report.overallEsgRating}</div>
              <div className="text-sm font-medium text-brand-600/80 mt-1 uppercase">Overall Rating</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-700">{report.esgScoreSummary?.environmental}</div>
              <div className="text-sm font-medium text-green-600/80 mt-1 uppercase">Environment</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-700">{report.esgScoreSummary?.social}</div>
              <div className="text-sm font-medium text-blue-600/80 mt-1 uppercase">Social</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-700">{report.esgScoreSummary?.governance}</div>
              <div className="text-sm font-medium text-purple-600/80 mt-1 uppercase">Governance</div>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">Executive Summary</h3>
          <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{report.executiveSummary}</p>

          <h3 className="text-xl font-bold mt-8 mb-4">Environmental Analysis</h3>
          <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{report.environmentalAnalysis}</p>

          <h3 className="text-xl font-bold mt-8 mb-4">Social Analysis</h3>
          <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{report.socialAnalysis}</p>

          <h3 className="text-xl font-bold mt-8 mb-4">Governance Analysis</h3>
          <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{report.governanceAnalysis}</p>
          
          {report.risksIdentified && report.risksIdentified.length > 0 && (
            <>
              <h3 className="text-xl font-bold mt-8 mb-4">Risks Identified</h3>
              <ul className="list-disc pl-5 space-y-2">
                {report.risksIdentified.map((risk, i) => (
                  <li key={i} className="text-ink-700">{risk}</li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-12 pt-8 border-t border-ink-100 flex justify-center">
             <button 
              onClick={() => setReport(null)}
              className="text-brand-600 font-medium hover:underline"
            >
              Generate New Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
