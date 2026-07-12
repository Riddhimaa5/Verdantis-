import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import AboutPillars from '../components/landing/AboutPillars'
import FeatureGrid from '../components/landing/FeatureGrid'
import CTASection from '../components/landing/CTASection'
import LandingFooter from '../components/landing/LandingFooter'

export default function Landing() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <LandingNav />
      <Hero />
      <AboutPillars />
      <FeatureGrid />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
