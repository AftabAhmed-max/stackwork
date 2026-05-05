/* ============================================
   CONTACT PAGE
   ============================================ */
import ContactHero from '@/components/sections/contact/ContactHero'
import ContactForm from '@/components/sections/contact/ContactForm'
import FadeInSection from '@/components/ui/FadeInSection'

export default function ContactPage() {
  return (
    <main style={{ paddingTop: '88px' }}>
      <ContactHero />
      <hr className="section-glow-line" />
      <FadeInSection>
        <ContactForm />
      </FadeInSection>
    </main>
  )
}