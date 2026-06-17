/* ============================================
   HOME PAGE
   ============================================ */
import Hero            from '@/components/sections/home/Hero'
import ProblemSection  from '@/components/sections/home/ProblemSection'
import ServicesOverview from '@/components/sections/home/ServicesOverview'
import WhyStackwork    from '@/components/sections/home/WhyStackwork'
import CTABanner       from '@/components/sections/home/CTABanner'
import FadeInSection   from '@/components/ui/FadeInSection'

export default function HomePage() {
  return (
    <main style={{ paddingTop: '88px' }}>

      {/* Hero — no fade, immediate */}
      <Hero />

      <hr className="section-glow-line" />

      {/* Problem Section */}
      <FadeInSection>
        <ProblemSection />
      </FadeInSection>

      <hr className="section-glow-line" />

      {/* Services Overview */}
      <FadeInSection delay={0.1}>
        <ServicesOverview />
      </FadeInSection>

      <hr className="section-glow-line" />

      {/* Why Stackwork */}
      <FadeInSection delay={0.1}>
        <WhyStackwork />
      </FadeInSection>

      <hr className="section-glow-line" />

      {/* CTA Banner */}
      <FadeInSection delay={0.1}>
        <CTABanner />
      </FadeInSection>

    </main>
  )
}