/**
 * ESGReportGenerator.jsx
 * Compiles Social, Governance, and ESG Summary Reports.
 * Provides filters for Department, Employee, Challenge, and Date Range.
 * Supports exporting data to CSV and triggering a clean printable PDF layout.
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileDown, Printer, Filter, Calendar, Users, Award, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

// Import all state contexts
import { useCSR } from '../../store/csrStore'
import { useChallenge } from '../../store/challengeStore'
import { usePolicy } from '../../store/policyStore'
import { useAudit, isIssueOverdue } from '../../store/auditStore'
import { useGamification } from '../../store/gamificationStore'
import Button from '../common/Button'

export default function ESGReportGenerator() {
  const csr = useCSR()
  const challenge = useChallenge()
  const policy = usePolicy()
  const audit = useAudit()
  const gamification = useGamification()

  // State
  const [reportType, setReportType] = useState('summary') // summary | social | governance
  const [filterDept, setFilterDept] = useState('All')
  const [filterEmployee, setFilterEmployee] = useState('All')
  const [filterChallenge, setFilterChallenge] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // ── Derived list options for filters ──────────────────────────────────────

  const departments = ['All', 'Operations', 'Manufacturing', 'R&D', 'Logistics', 'Corporate']
  
  const employees = useMemo(() => {
    return ['All', ...gamification.state.employees.map((e) => e.name)]
  }, [gamification.state.employees])

  const challenges = useMemo(() => {
    return ['All', ...challenge.state.challenges.map((c) => c.title)]
  }, [challenge.state.challenges])

  // ── Report compiler logic (applies filters) ───────────────────────────────

  const compiledData = useMemo(() => {
    // 1. Filter CSR activities & participations
    let filteredParts = [...csr.state.participations].filter((p) => p.status === 'approved')
    let filteredActs = [...csr.state.activities]

    // 2. Filter Challenge participations & challenges
    let filteredChalParts = [...challenge.state.participations].filter((p) => p.status === 'approved')
    let filteredChals = [...challenge.state.challenges]

    // Apply department filter
    if (filterDept !== 'All') {
      filteredParts = filteredParts.filter((p) => p.employeeDept === filterDept)
      filteredChalParts = filteredChalParts.filter((p) => p.employeeDept === filterDept)
    }

    // Apply employee filter
    if (filterEmployee !== 'All') {
      filteredParts = filteredParts.filter((p) => p.employeeName === filterEmployee)
      filteredChalParts = filteredChalParts.filter((p) => p.employeeName === filterEmployee)
    }

    // Apply date range filters
    if (startDate) {
      filteredActs = filteredActs.filter((a) => a.date >= startDate)
      filteredChals = filteredChals.filter((c) => c.startDate >= startDate)
      filteredParts = filteredParts.filter((p) => p.joinedAt >= startDate)
      filteredChalParts = filteredChalParts.filter((p) => p.joinedAt >= startDate)
    }
    if (endDate) {
      filteredActs = filteredActs.filter((a) => a.date <= endDate)
      filteredChals = filteredChals.filter((c) => c.endDate <= endDate)
      filteredParts = filteredParts.filter((p) => p.joinedAt <= endDate)
      filteredChalParts = filteredChalParts.filter((p) => p.joinedAt <= endDate)
    }

    // Apply challenge filter (Challenge name matches)
    if (filterChallenge !== 'All') {
      const chalObj = challenge.state.challenges.find((c) => c.title === filterChallenge)
      if (chalObj) {
        filteredChalParts = filteredChalParts.filter((p) => p.challengeId === chalObj.id)
      }
    }

    // 3. Social Report metrics calculation
    const totalCSRHours = filteredParts.reduce((sum, p) => {
      const act = csr.state.activities.find((a) => a.id === p.activityId)
      return sum + (act?.hoursAwarded ?? 0)
    }, 0)

    const socialParticipants = new Set(filteredParts.map((p) => p.employeeId)).size

    // 4. Governance Report metrics calculation
    const activePolicyIds = policy.state.policies.filter((p) => p.status === 'active').map((p) => p.id)
    let filteredAcks = policy.state.acknowledgements.filter((ack) =>
      activePolicyIds.includes(ack.policyId),
    )

    if (filterDept !== 'All') {
      filteredAcks = filteredAcks.filter((a) => a.employeeDept === filterDept)
    }
    if (filterEmployee !== 'All') {
      filteredAcks = filteredAcks.filter((a) => a.employeeName === filterEmployee)
    }

    const acknowledgedCount = filteredAcks.filter((ack) => ack.status === 'acknowledged').length
    const totalTargetAcks = filteredAcks.length
    const complianceRate =
      totalTargetAcks > 0 ? Math.round((acknowledgedCount / totalTargetAcks) * 100) : 100

    const totalAudits = audit.state.audits.length
    const openIssues = audit.state.issues.filter((i) => i.status !== 'resolved')
    const overdueIssuesCount = openIssues.filter((i) => isIssueOverdue(i)).length

    return {
      social: {
        totalCSRHours,
        participantsCount: socialParticipants,
        approvedParticipations: filteredParts,
      },
      governance: {
        complianceRate,
        totalAudits,
        openIssuesCount: openIssues.length,
        overdueIssuesCount,
        policyAcks: filteredAcks,
      },
      challengeStats: {
        completedCount: filteredChalParts.length,
        participations: filteredChalParts,
      },
    }
  }, [
    csr.state,
    challenge.state,
    policy.state,
    audit.state,
    gamification.state,
    filterDept,
    filterEmployee,
    filterChallenge,
    startDate,
    endDate,
  ])

  // ── CSV Export handler ─────────────────────────────────────────────────────

  function handleCSVExport() {
    let headers = []
    let rows = []
    let filename = `verdantis-${reportType}-report.csv`

    if (reportType === 'social') {
      headers = ['Activity ID', 'Participant Name', 'Department', 'Participation Status', 'Date Logged']
      rows = compiledData.social.approvedParticipations.map((p) => [
        p.activityId,
        p.employeeName,
        p.employeeDept,
        p.status,
        new Date(p.joinedAt).toLocaleDateString(),
      ])
    } else if (reportType === 'governance') {
      headers = ['Policy Name', 'Employee Name', 'Department', 'Acknowledgment Status', 'Date Acknowledged']
      rows = compiledData.governance.policyAcks.map((ack) => {
        const pol = policy.state.policies.find((p) => p.id === ack.policyId)
        return [
          pol?.title || ack.policyId,
          ack.employeeName,
          ack.employeeDept,
          ack.status,
          ack.acknowledgedAt ? new Date(ack.acknowledgedAt).toLocaleDateString() : 'N/A',
        ]
      })
    } else {
      // Summary
      headers = ['Metric Category', 'Metric Indicator', 'Metric Value']
      rows = [
        ['Social', 'CSR Total Hours Logged', compiledData.social.totalCSRHours],
        ['Social', 'Active CSR Participants', compiledData.social.participantsCount],
        ['Engagement', 'Challenges Completed', compiledData.challengeStats.completedCount],
        ['Governance', 'Policy Compliance Rate', `${compiledData.governance.complianceRate}%`],
        ['Governance', 'Total Audits Conducted', compiledData.governance.totalAudits],
        ['Governance', 'Open Compliance Issues', compiledData.governance.openIssuesCount],
        ['Governance', 'Critical Overdue Issues', compiledData.governance.overdueIssuesCount],
      ]
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ── PDF Print handler ──────────────────────────────────────────────────────

  function handlePDFPrint() {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Selection row */}
      <div className="flex items-center gap-1 bg-ink-100/60 rounded-xl p-1 w-fit flex-wrap">
        <button
          onClick={() => setReportType('summary')}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            reportType === 'summary' ? 'bg-white text-ink-800 shadow-soft' : 'text-ink-500 hover:text-ink-700',
          )}
        >
          ESG Summary Report
        </button>
        <button
          onClick={() => setReportType('social')}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            reportType === 'social' ? 'bg-white text-ink-800 shadow-soft' : 'text-ink-500 hover:text-ink-700',
          )}
        >
          Social Report (CSR)
        </button>
        <button
          onClick={() => setReportType('governance')}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            reportType === 'governance' ? 'bg-white text-ink-800 shadow-soft' : 'text-ink-500 hover:text-ink-700',
          )}
        >
          Governance Report
        </button>
      </div>

      {/* Filters Card */}
      <div className="card p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
        {/* Department Filter */}
        <div>
          <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">
            Business Unit / Dept
          </label>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Employee Filter */}
        <div>
          <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">
            Specific Employee
          </label>
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors"
          >
            {employees.map((empName) => (
              <option key={empName}>{empName}</option>
            ))}
          </select>
        </div>

        {/* Challenge Filter */}
        <div>
          <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">
            Associated Challenge
          </label>
          <select
            value={filterChallenge}
            disabled={reportType === 'governance'}
            onChange={(e) => setFilterChallenge(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:bg-white transition-colors disabled:opacity-50"
          >
            {challenges.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Date Ranges */}
        <div>
          <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Calendar size={12} /> Date Horizon
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-ink-50 px-2.5 py-1.5 text-xs text-ink-800 outline-none focus:border-brand-400"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-ink-50 px-2.5 py-1.5 text-xs text-ink-800 outline-none focus:border-brand-400"
            />
          </div>
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" icon={FileDown} onClick={handleCSVExport}>
          Export CSV
        </Button>
        <Button variant="secondary" size="sm" icon={Printer} onClick={handlePDFPrint}>
          Print Report (PDF)
        </Button>
      </div>

      {/* Compiled Report Preview (Clean printable wrapper) */}
      <div id="print-area" className="card p-8 bg-white border flex flex-col gap-6 relative">
        <div className="flex justify-between items-start border-b border-ink-100 pb-5 flex-wrap gap-4">
          <div>
            <h3 className="font-display font-bold text-ink-800 text-lg uppercase tracking-wide">
              {reportType === 'summary' && 'ESG Summary Audit'}
              {reportType === 'social' && 'Social Performance Report'}
              {reportType === 'governance' && 'Governance Compliance Review'}
            </h3>
            <p className="text-xs text-ink-400 mt-1">
              Meridian Foods Group · Fiscal Year 2026
            </p>
          </div>
          <div className="text-right text-xs text-ink-500 bg-ink-50 px-3 py-1.5 rounded-lg border border-ink-100">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p className="mt-0.5">BU Filter: <span className="font-semibold">{filterDept}</span></p>
          </div>
        </div>

        {/* REPORT CONTENT COMPILATION */}
        {reportType === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-ink-100 p-5 rounded-xl flex flex-col gap-1.5 bg-brand-50/10">
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">Environmental</span>
              <p className="font-mono text-3xl font-bold text-ink-800">
                {compiledData.challengeStats.completedCount}
              </p>
              <p className="text-xs text-ink-400 mt-1">Challenges fully resolved & verified under filters.</p>
            </div>
            <div className="border border-ink-100 p-5 rounded-xl flex flex-col gap-1.5 bg-violet-50/10">
              <span className="text-xs font-semibold text-social uppercase tracking-wide">Social</span>
              <p className="font-mono text-3xl font-bold text-ink-800">
                {compiledData.social.totalCSRHours} <span className="text-sm font-sans font-medium text-ink-500">Hours</span>
              </p>
              <p className="text-xs text-ink-400 mt-1">Logged by {compiledData.social.participantsCount} unique contributors.</p>
            </div>
            <div className="border border-ink-100 p-5 rounded-xl flex flex-col gap-1.5 bg-blue-50/10">
              <span className="text-xs font-semibold text-governance uppercase tracking-wide">Governance</span>
              <p className="font-mono text-3xl font-bold text-ink-800">
                {compiledData.governance.complianceRate}%
              </p>
              <p className="text-xs text-ink-400 mt-1">Overall acknowledgment rate across active corporate policies.</p>
            </div>
          </div>
        )}

        {reportType === 'social' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-ink-50/50 p-4 rounded-xl text-center border border-ink-100">
                <p className="font-mono text-3xl font-bold text-brand-700">{compiledData.social.totalCSRHours}</p>
                <p className="text-xs font-medium text-ink-400 uppercase mt-1 tracking-wider">CSR Hours Logged</p>
              </div>
              <div className="bg-ink-50/50 p-4 rounded-xl text-center border border-ink-100">
                <p className="font-mono text-3xl font-bold text-social">{compiledData.social.participantsCount}</p>
                <p className="text-xs font-medium text-ink-400 uppercase mt-1 tracking-wider">Active Volunteers</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-ink-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-ink-50 text-ink-500 font-semibold border-b border-ink-100 uppercase tracking-wide">
                    <th className="p-3">Volunteer</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Activity Status</th>
                    <th className="p-3 text-right">Log Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {compiledData.social.approvedParticipations.map((p) => (
                    <tr key={p.id} className="hover:bg-ink-50/20">
                      <td className="p-3 font-medium text-ink-700">{p.employeeName}</td>
                      <td className="p-3 text-ink-500">{p.employeeDept}</td>
                      <td className="p-3">
                        <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-medium">Approved</span>
                      </td>
                      <td className="p-3 text-right text-ink-400">{new Date(p.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {compiledData.social.approvedParticipations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-ink-400">
                        No volunteer records found under selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'governance' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-ink-50/50 p-4 rounded-xl text-center border border-ink-100">
                <p className="font-mono text-xl font-bold text-ink-800">{compiledData.governance.complianceRate}%</p>
                <p className="text-[10px] font-medium text-ink-400 uppercase mt-1">Compliance Rate</p>
              </div>
              <div className="bg-ink-50/50 p-4 rounded-xl text-center border border-ink-100">
                <p className="font-mono text-xl font-bold text-ink-800">{compiledData.governance.totalAudits}</p>
                <p className="text-[10px] font-medium text-ink-400 uppercase mt-1">Audits Run</p>
              </div>
              <div className="bg-ink-50/50 p-4 rounded-xl text-center border border-ink-100">
                <p className="font-mono text-xl font-bold text-warn">{compiledData.governance.openIssuesCount}</p>
                <p className="text-[10px] font-medium text-ink-400 uppercase mt-1">Open Issues</p>
              </div>
              <div className="bg-ink-50/50 p-4 rounded-xl text-center border border-ink-100">
                <p className="font-mono text-xl font-bold text-danger">{compiledData.governance.overdueIssuesCount}</p>
                <p className="text-[10px] font-medium text-ink-400 uppercase mt-1">Overdue Items</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-ink-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-ink-50 text-ink-500 font-semibold border-b border-ink-100 uppercase tracking-wide">
                    <th className="p-3">Policy Title</th>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3 text-right">Acknowledgement Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {compiledData.governance.policyAcks.map((ack) => {
                    const pol = policy.state.policies.find((p) => p.id === ack.policyId)
                    return (
                      <tr key={ack.id} className="hover:bg-ink-50/20">
                        <td className="p-3 font-medium text-ink-700">{pol?.title || ack.policyId}</td>
                        <td className="p-3 text-ink-700">{ack.employeeName}</td>
                        <td className="p-3 text-ink-500">{ack.employeeDept}</td>
                        <td className="p-3 text-right">
                          {ack.status === 'acknowledged' ? (
                            <span className="text-brand-700 font-medium bg-brand-50 px-1.5 py-0.5 rounded">
                              {new Date(ack.acknowledgedAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-danger font-medium bg-red-50 px-1.5 py-0.5 rounded">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {compiledData.governance.policyAcks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-ink-400">
                        No policy audit logs found under selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="border-t border-dashed border-ink-200 pt-4 flex items-center justify-between text-[10px] text-ink-400">
          <p>Confidential · Internal ESG Audit System</p>
          <p>© 2026 Verdantis Enterprises</p>
        </div>
      </div>
    </div>
  )
}
