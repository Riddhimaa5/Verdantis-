import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Leaf,
  Calculator,
  HeartHandshake,
  ShieldCheck,
  Trophy,
  BarChart3,
  FileText,
  Users,
  ArrowUpRight,
} from 'lucide-react'

const features = [
  { to: '/environmental', icon: Leaf, title: 'Environmental', body: 'Emissions, reduction goals, and department-level breakdowns.' },
  { to: '/carbon-accounting', icon: Calculator, title: 'Carbon Accounting', body: 'Calculate, log, and audit emissions with a full history.' },
  { to: '/csr', icon: HeartHandshake, title: 'CSR Activities', body: 'Plan and track community and volunteer programs.' },
  { to: '/governance', icon: ShieldCheck, title: 'Governance', body: 'Policies, compliance status, and audit history in one view.' },
  { to: '/challenges', icon: Trophy, title: 'Challenges', body: 'Gamified sustainability challenges that earn XP and badges.' },
  { to: '/leaderboard', icon: BarChart3, title: 'Leaderboard', body: 'Rankings by employee, team, and department.' },
  { to: '/reports', icon: FileText, title: 'Reports', body: 'KPI-driven reports, exportable to PDF, Excel, or CSV.' },
  { to: '/employees', icon: Users, title: 'Employees', body: 'Every employee\u2019s ESG contribution, XP, and badges.' },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="bg-white border-y border-ink-100">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Explore the platform</p>
          <h2 className="font-display font-bold text-ink-800 text-2xl md:text-3xl leading-tight">
            Everything your ESG team needs, in one place
          </h2>
          <p className="text-ink-500 text-[15px] leading-relaxed mt-4">
            Jump straight into any part of the platform below — or open the full Dashboard for the complete
            picture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
            >
              <Link
                to={f.to}
                className="group flex flex-col h-full card p-5 hover:shadow-card hover:border-brand-200 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <f.icon size={18} className="text-brand-600" />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-ink-300 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <h3 className="font-display font-semibold text-ink-800 text-[15px] mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{f.body}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
