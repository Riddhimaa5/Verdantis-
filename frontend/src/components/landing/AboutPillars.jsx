import { motion } from 'framer-motion'
import { Leaf, Users, ShieldCheck, Trophy } from 'lucide-react'

const pillars = [
  {
    icon: Leaf,
    color: 'text-brand-600 bg-brand-50',
    title: 'Environmental',
    body: 'Track carbon emissions by department, model reduction scenarios, and stay ahead of climate reporting requirements.',
  },
  {
    icon: Users,
    color: 'text-social bg-violet-50',
    title: 'Social',
    body: 'Run CSR programs end to end — plan activities, log volunteer hours, and measure the community impact you create.',
  },
  {
    icon: ShieldCheck,
    color: 'text-governance bg-blue-50',
    title: 'Governance',
    body: 'Keep policies, audits, and risk registers in one place, with a live view of compliance across the business.',
  },
  {
    icon: Trophy,
    color: 'text-warn bg-amber-50',
    title: 'Engagement',
    body: 'Turn sustainability into a habit with challenges, XP, and leaderboards that get every employee involved.',
  },
]

export default function AboutPillars() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">What Verdantis is</p>
        <h2 className="font-display font-bold text-ink-800 text-2xl md:text-3xl leading-tight">
          One platform for every part of your ESG program
        </h2>
        <p className="text-ink-500 text-[15px] leading-relaxed mt-4">
          Verdantis is an AI-powered ESG management platform. It replaces scattered spreadsheets and one-off
          reports with a single source of truth — so your sustainability team, your auditors, and your employees
          are always looking at the same numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${p.color}`}>
              <p.icon size={19} />
            </div>
            <h3 className="font-display font-semibold text-ink-800 text-[15px] mb-1.5">{p.title}</h3>
            <p className="text-sm text-ink-500 leading-relaxed">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
