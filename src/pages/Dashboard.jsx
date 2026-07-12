import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import PerformanceOverview from '../components/dashboard/PerformanceOverview'
import CarbonTrendChart from '../components/dashboard/CarbonTrendChart'
import DepartmentCarbonChart from '../components/dashboard/DepartmentCarbonChart'
import ProgramsGovernanceSection from '../components/dashboard/ProgramsGovernanceSection'
import ActivityFeedSection from '../components/dashboard/ActivityFeedSection'
import AIQuickActionsBar from '../components/dashboard/AIQuickActionsBar'
import Section from '../components/common/Section'
import { aiRecommendation } from '../data/mockData'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-10">
      <WelcomeBanner />

      <Section eyebrow="Snapshot" title="Performance overview" subtitle="Your composite ESG score and this quarter's key figures, at a glance.">
        <PerformanceOverview />
      </Section>

      <Section eyebrow="Environment" title="Emissions & trends" subtitle="Where your carbon footprint is moving, and which teams are driving it.">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CarbonTrendChart />
          <DepartmentCarbonChart />
        </div>
      </Section>

      <Section eyebrow="Social & Governance" title="Programs & compliance" subtitle="Progress on long-term goals, community impact, and policy review.">
        <ProgramsGovernanceSection />
      </Section>

      <Section eyebrow="Organization" title="Activity & people" subtitle="What's happening across teams, what's coming up, and who's leading.">
        <ActivityFeedSection />
      </Section>

      <AIQuickActionsBar recommendation={aiRecommendation} />
    </div>
  )
}
