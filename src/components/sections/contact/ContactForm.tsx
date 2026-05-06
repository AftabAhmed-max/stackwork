/* ============================================
   CONTACT FORM
   - Left: form fields
   - Right: contact details + what happens next
   - Wired to EmailJS
   ============================================ */
'use client'

import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { Mail, MessageSquare, MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  'Web Design & Development',
  'Mobile & Web App Development',
  'Data Analytics & BI Dashboards',
  'Business Setup',
  'Maintenance & Retainer Plans',
  'Not sure yet',
]

const budgets = [
  'Under ₹25,000 / $500',
  '₹25,000–₹75,000 / $500–$1,500',
  '₹75,000–₹2,00,000 / $1,500–$4,000',
  'Above ₹2,00,000 / $4,000+',
  'Let\'s discuss',
]

/* ---- Reusable input style ---- */
const inputStyle: React.CSSProperties = {
  width:           '100%',
  backgroundColor: 'rgba(13,27,62,0.6)',
  border:          '1px solid rgba(255,255,255,0.1)',
  borderRadius:    '8px',
  padding:         '12px 16px',
  fontFamily:      'var(--font-body)',
  fontSize:        '15px',
  color:           '#ffffff',
  outline:         'none',
  transition:      'border-color 0.2s ease',
  boxSizing:       'border-box',
}

export default function ContactForm() {
  const [isMobile, setIsMobile] = useState(false)
  const [status,   setStatus]   = useState<'idle'|'sending'|'success'|'error'>('idle')

  const [form, setForm] = useState({
    from_name:            '',
    business_name:        '',
    country:              '',
    reply_to:             '',
    service:              '',
    budget:               '',
    business_description: '',
    message:              '',
  })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.from_name || !form.reply_to || !form.business_description || !form.message) {
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      setStatus('success')
      setForm({ from_name: '', business_name: '', country: '', reply_to: '', service: '', budget: '', business_description: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section style={{ padding: isMobile ? '40px 24px 80px' : '60px 60px 100px' }}>
      <div style={{
        maxWidth:            '1200px',
        margin:              '0 auto',
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
        gap:                 isMobile ? '48px' : '80px',
        alignItems:          'flex-start',
      }}>

        {/* ============ LEFT: FORM ============ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <h2 style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     isMobile ? '24px' : '32px',
            fontWeight:   700,
            color:        '#ffffff',
            marginBottom: '8px',
          }}>
            Let's Build Together
          </h2>

          {/* Row 1 — Name + Business */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                Your Name *
              </label>
              <input
                name="from_name"
                value={form.from_name}
                onChange={handleChange}
                placeholder="John Doe"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#FF6B35')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                Business Name
              </label>
              <input
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                placeholder="Your Company"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#FF6B35')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
          </div>

          {/* Row 2 — Email + Country */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                Email Address *
              </label>
              <input
                name="reply_to"
                type="email"
                value={form.reply_to}
                onChange={handleChange}
                placeholder="you@company.com"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#FF6B35')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
                Country
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="India / UAE / Qatar..."
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#FF6B35')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
          </div>

          {/* Row 3 — Service */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
              Service Interested In
            </label>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              style={{ ...inputStyle, appearance: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#FF6B35')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            >
              <option value="" style={{ backgroundColor: '#0D1B3E' }}>Select a service...</option>
              {services.map(s => (
                <option key={s} value={s} style={{ backgroundColor: '#0D1B3E' }}>{s}</option>
              ))}
            </select>
          </div>

          {/* Row 4 — Budget */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
              Budget Range
            </label>
            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
              style={{ ...inputStyle, appearance: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#FF6B35')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            >
              <option value="" style={{ backgroundColor: '#0D1B3E' }}>Select a range...</option>
              {budgets.map(b => (
                <option key={b} value={b} style={{ backgroundColor: '#0D1B3E' }}>{b}</option>
              ))}
            </select>
          </div>

          {/* Row 5 — Message */}
          {/* Business description field */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
              Tell Us About Your Business *
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, marginLeft: '8px' }}>What does your business do?</span>
            </label>
            <textarea
              name="business_description"
              value={(form as any).business_description || ''}
              onChange={handleChange}
              placeholder="e.g. We run a chain of 3 restaurants in Dubai and need a website with online ordering and table reservations..."
              rows={2}
              style={{ ...inputStyle, resize: 'none', minHeight: '70px' }}
              onFocus={e => (e.target.style.borderColor = '#FF6B35')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Project details field */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>
              What Do You Need From Us? *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe what you're looking to build or fix, any specific requirements, timeline expectations..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
              onFocus={e => (e.target.style.borderColor = '#FF6B35')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Error message */}
          {status === 'error' && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#FF5F57' }}>
              Please fill in your name, email, and message before submitting.
            </p>
          )}

          {/* Submit button */}
          {status === 'success' ? (
            <div style={{
              display:         'flex',
              alignItems:      'center',
              gap:             '12px',
              backgroundColor: 'rgba(44,110,73,0.15)',
              border:          '1px solid rgba(44,110,73,0.4)',
              borderRadius:    '8px',
              padding:         '16px 20px',
            }}>
              <CheckCircle size={20} color="#2C6E49" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#2C6E49' }}>
                Message sent! We'll get back to you within 24 hours.
              </span>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={status === 'sending'}
              className="cta-pulse"
              style={{
                backgroundColor: status === 'sending' ? 'rgba(255,107,53,0.6)' : '#FF6B35',
                color:           '#ffffff',
                fontFamily:      'var(--font-body)',
                fontWeight:      500,
                fontSize:        '16px',
                padding:         '14px 32px',
                borderRadius:    '6px',
                border:          'none',
                cursor:          status === 'sending' ? 'not-allowed' : 'pointer',
                display:         'inline-flex',
                alignItems:      'center',
                gap:             '10px',
                alignSelf:       'flex-start',
              }}
            >
              {status === 'sending' ? 'Sending...' : <>Send Message <ArrowRight size={16} /></>}
            </button>
          )}
        </div>

        {/* ============ RIGHT: DETAILS ============ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Contact details */}
          <div className="card-animated" style={{
            backgroundColor: 'rgba(13,27,62,0.5)',
            borderRadius:    '12px',
            padding:         '28px',
            border:          '1px solid rgba(255,255,255,0.06)',
            display:         'flex',
            flexDirection:   'column',
            gap:             '20px',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
              Contact Details
            </h3>

            {[
              { icon: Mail,           text: 'stackworkhq@gmail.com',          href: 'mailto:stackworkhq@gmail.com',       color: '#FF6B35' },
              { icon: MessageSquare,  text: '+91 96979 80079',                 href: 'https://wa.me/919697980079',         color: '#00D4FF' },
              { icon: MapPin,         text: 'Mumbai, India',                   href: null,                                 color: '#C9A84C' },
              { icon: Clock,          text: 'Response within 24 hours',        href: null,                                 color: '#8B5CF6' },
            ].map(({ icon: Icon, text, href, color }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width:           '38px',
                  height:          '38px',
                  borderRadius:    '8px',
                  backgroundColor: `${color}15`,
                  border:          `1px solid ${color}30`,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  flexShrink:      0,
                }}>
                  <Icon size={16} color={color} />
                </div>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" style={{
                    fontFamily:     'var(--font-body)',
                    fontSize:       '15px',
                    color:          'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition:     'color 0.2s ease',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = color)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {text}
                  </a>
                ) : (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.7)' }}>
                    {text}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* What happens next */}
          <div className="card-animated" style={{
            backgroundColor: 'rgba(13,27,62,0.5)',
            borderRadius:    '12px',
            padding:         '28px',
            border:          '1px solid rgba(255,255,255,0.06)',
            display:         'flex',
            flexDirection:   'column',
            gap:             '20px',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
              What Happens Next
            </h3>

            {[
              { step: '01', text: 'We review your inquiry and respond within 24 hours',    color: '#FF6B35' },
              { step: '02', text: 'We schedule a free discovery call to understand your needs', color: '#00D4FF' },
              { step: '03', text: 'You receive a clear proposal with timeline and pricing',  color: '#C9A84C' },
            ].map((item) => (
              <div key={item.step} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily:      'var(--font-heading)',
                  fontSize:        '11px',
                  fontWeight:      700,
                  color:           item.color,
                  backgroundColor: `${item.color}12`,
                  border:          `1px solid ${item.color}30`,
                  borderRadius:    '100px',
                  padding:         '2px 10px',
                  flexShrink:      0,
                  marginTop:       '2px',
                }}>
                  {item.step}
                </span>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   '14px',
                  color:      'rgba(255,255,255,0.6)',
                  lineHeight: 1.6,
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/919697980079"
            target="_blank"
            rel="noreferrer"
            className="cta-pulse"
            style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             '10px',
              backgroundColor: '#25D366',
              color:           '#ffffff',
              fontFamily:      'var(--font-body)',
              fontWeight:      500,
              fontSize:        '15px',
              padding:         '13px 24px',
              borderRadius:    '6px',
              textDecoration:  'none',
            }}
          >
            <MessageSquare size={18} />
            Chat on WhatsApp Instead
          </a>

        </div>
      </div>
    </section>
  )
}