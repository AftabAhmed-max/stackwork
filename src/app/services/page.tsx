/* ============================================
   SERVICES PAGE
   ============================================ */
import ServicesHero      from '@/components/sections/services/ServicesHero'
import ServicesShowcase  from '@/components/sections/services/ServicesShowcase'
import EngagementModels  from '@/components/sections/services/EngagementModels'
import ProcessStrip      from '@/components/sections/services/ProcessStrip'
import ServicesCTA       from '@/components/sections/services/ServicesCTA'
import FadeInSection     from '@/components/ui/FadeInSection'

export default function ServicesPage() {
  return (
    <main style={{ paddingTop: '88px' }}>
      <ServicesHero />
      <hr className="section-glow-line" />
      <ServicesShowcase />
      <hr className="section-glow-line" />
      <FadeInSection>
        <EngagementModels />
      </FadeInSection>
      <hr className="section-glow-line" />
      <FadeInSection>
        <ProcessStrip />
      </FadeInSection>
      <hr className="section-glow-line" />
      <FadeInSection>
        <ServicesCTA />
      </FadeInSection>
    </main>
  )
}