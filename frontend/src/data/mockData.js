// Realistic mock data for Verdantis — swap with live API responses later.

export const company = {
  name: 'Meridian Foods Group',
  plan: 'Enterprise',
  fiscalYear: 'FY 2026',
}

export const esgScore = {
  overall: 78,
  environmental: 74,
  social: 81,
  governance: 79,
  deltaOverall: 4.2, // vs last quarter
}

export const kpis = {
  carbonEmission: { value: 1284, unit: 't CO₂e', delta: -6.3, trend: 'down' },
  csrActivities: { value: 12, unit: 'active', delta: 3, trend: 'up' },
  employeeParticipation: { value: 68, unit: '%', delta: 5.1, trend: 'up' },
  compliance: { value: 96, unit: '%', delta: 1.4, trend: 'up' },
}

export const carbonTrend = [
  { month: 'Feb', emissions: 1510, target: 1600 },
  { month: 'Mar', emissions: 1465, target: 1560 },
  { month: 'Apr', emissions: 1420, target: 1520 },
  { month: 'May', emissions: 1390, target: 1480 },
  { month: 'Jun', emissions: 1340, target: 1440 },
  { month: 'Jul', emissions: 1284, target: 1400 },
]

export const departmentCarbon = [
  { department: 'Manufacturing', emissions: 512 },
  { department: 'Logistics', emissions: 341 },
  { department: 'Facilities', emissions: 198 },
  { department: 'R&D', emissions: 126 },
  { department: 'Corporate', emissions: 107 },
]

export const csrProgress = {
  completed: 27,
  total: 40,
  hoursLogged: 3120,
  fundsRaised: 84500,
}

export const governanceProgress = {
  score: 79,
  policiesReviewed: 22,
  policiesTotal: 26,
  openRisks: 3,
}

export const sustainabilityGoals = [
  { id: 1, label: 'Net-zero Scope 1 emissions', progress: 62, due: '2028' },
  { id: 2, label: 'Zero landfill waste', progress: 45, due: '2027' },
  { id: 3, label: '100% renewable electricity', progress: 71, due: '2026' },
  { id: 4, label: 'Water usage -30%', progress: 38, due: '2029' },
]

export const recentActivities = [
  { id: 1, text: 'Priya Sharma logged 8 CSR hours at Riverside Cleanup', time: '2h ago', type: 'csr' },
  { id: 2, text: 'Facilities dept. submitted Q2 energy audit', time: '5h ago', type: 'audit' },
  { id: 3, text: 'New policy "Supplier Code of Conduct v3" published', time: '1d ago', type: 'governance' },
  { id: 4, text: 'Manufacturing emissions dropped 4.1% month-over-month', time: '1d ago', type: 'carbon' },
  { id: 5, text: 'Arjun Mehta earned the "Carbon Cutter" badge', time: '2d ago', type: 'challenge' },
]

export const upcomingAudits = [
  { id: 1, name: 'ISO 14001 Surveillance Audit', date: 'Jul 22, 2026', owner: 'EHS Team', status: 'scheduled' },
  { id: 2, name: 'Supplier ESG Compliance Review', date: 'Jul 29, 2026', owner: 'Procurement', status: 'preparing' },
  { id: 3, name: 'Annual Governance Review', date: 'Aug 12, 2026', owner: 'Legal & Compliance', status: 'scheduled' },
]

export const leaderboard = [
  { id: 1, name: 'Priya Sharma', department: 'Operations', xp: 4820, badge: '🥇' },
  { id: 2, name: 'Arjun Mehta', department: 'Manufacturing', xp: 4510, badge: '🥈' },
  { id: 3, name: 'Kavya Iyer', department: 'R&D', xp: 4225, badge: '🥉' },
  { id: 4, name: 'Rohan Verma', department: 'Logistics', xp: 3890, badge: null },
  { id: 5, name: 'Sneha Nair', department: 'Corporate', xp: 3654, badge: null },
]

export const aiRecommendation = {
  title: 'Shift logistics routes to reduce Scope 3 emissions',
  body: 'Consolidating weekly shipments from the Pune and Nashik warehouses could cut transport-related emissions by an estimated 9% this quarter, based on your current route density and fuel mix.',
  impact: '−9% transport emissions',
  confidence: 'High confidence',
}

export const quickActions = [
  { id: 1, label: 'Log Emission Data' },
  { id: 2, label: 'Add CSR Activity' },
  { id: 3, label: 'Generate Report' },
  { id: 4, label: 'Invite Employee' },
]
