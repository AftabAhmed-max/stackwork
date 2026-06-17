/* ============================================
   ABOUT PAGE
   ============================================ */
import AboutHero    from '@/components/sections/about/AboutHero'
import FounderSection from '@/components/sections/about/FounderSection'
import ValuesSection  from '@/components/sections/about/ValuesSection'
import AboutCTA      from '@/components/sections/about/AboutCTA'
import FadeInSection from '@/components/ui/FadeInSection'

export default function AboutPage() {
  return (
    <main style={{ paddingTop: '88px' }}>
      <AboutHero />
      <hr className="section-glow-line" />
      <FadeInSection>
        <FounderSection />
      </FadeInSection>
      <hr className="section-glow-line" />
      <FadeInSection>
        <ValuesSection />
      </FadeInSection>
      <hr className="section-glow-line" />
      <FadeInSection>
        <AboutCTA />
      </FadeInSection>
    </main>
  )
}