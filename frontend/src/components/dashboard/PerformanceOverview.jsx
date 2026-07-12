import { Leaf, Users, ShieldCheck, Flame, HeartHandshake, UserCheck, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import ESGGauge from '../common/ESGGauge'
import MiniStat from '../common/MiniStat'
import { HDivider, VDivider } from '../common/Divider'
import { esgScore, kpis } from '../../data/mockData'

export default function PerformanceOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card p-6 flex flex-col md:flex-row gap-8"
    >
      <div className="flex justify-center md:justify-start shrink-0">
        <ESGGauge
          overall={esgScore.overall}
          environmental={esgScore.environmental}
          social={esgScore.social}
          governance={esgScore.governance}
          size={220}
        />
      </div>

      <VDivider />

      <div className="flex-1 flex flex-col gap-5 min-w-0">
        <div>
          <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Pillar scores</p>
          <div className="flex flex-wrap gap-6">
            <MiniStat icon={Leaf} label="Environmental" value={esgScore.environmental} accent="text-brand-600" />
            <MiniStat icon={Users} label="Social" value={esgScore.social} accent="text-social" />
            <MiniStat icon={ShieldCheck} label="Governance" value={esgScore.governance} accent="text-governance" />
          </div>
        </div>

        <HDivider />

        <div>
          <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">This quarter</p>
          <div className="flex flex-wrap gap-6">
            <MiniStat
              icon={Flame}
              label="Carbon Emission"
              value={kpis.carbonEmission.value}
              unit={kpis.carbonEmission.unit}
              delta={kpis.carbonEmission.delta}
              trend={kpis.carbonEmission.trend}
              goodDirection="down"
              accent="text-brand-600"
            />
            <MiniStat
              icon={HeartHandshake}
              label="CSR Activities"
              value={kpis.csrActivities.value}
              unit={kpis.csrActivities.unit}
              delta={kpis.csrActivities.delta}
              trend={kpis.csrActivities.trend}
              accent="text-teal-600"
            />
            <MiniStat
              icon={UserCheck}
              label="Participation"
              value={kpis.employeeParticipation.value}
              unit={kpis.employeeParticipation.unit}
              delta={kpis.employeeParticipation.delta}
              trend={kpis.employeeParticipation.trend}
              accent="text-social"
            />
            <MiniStat
              icon={BadgeCheck}
              label="Compliance"
              value={kpis.compliance.value}
              unit={kpis.compliance.unit}
              delta={kpis.compliance.delta}
              trend={kpis.compliance.trend}
              accent="text-governance"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
