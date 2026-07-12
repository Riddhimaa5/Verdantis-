import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Placeholder name="Login" />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/environmental" element={<Placeholder name="Environmental" />} />
        <Route path="/carbon-accounting" element={<Placeholder name="Carbon Accounting" />} />
        <Route path="/csr" element={<Placeholder name="CSR Activities" />} />
        <Route path="/governance" element={<Placeholder name="Governance" />} />
        <Route path="/challenges" element={<Placeholder name="Challenges" />} />
        <Route path="/leaderboard" element={<Placeholder name="Leaderboard" />} />
        <Route path="/reports" element={<Placeholder name="Reports" />} />
        <Route path="/employees" element={<Placeholder name="Employees" />} />
        <Route path="/notifications" element={<Placeholder name="Notifications" />} />
        <Route path="/settings" element={<Placeholder name="Settings" />} />
      </Route>

      <Route path="*" element={<Placeholder name="Page" />} />
    </Routes>
  )
}
