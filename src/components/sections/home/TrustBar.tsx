/* ============================================
   TRUST BAR SECTION
   - Single strip of social proof
   - Regional presence + key stats
   - Subtle separator design
   ============================================ */

const regions = ['India', 'UAE', 'Qatar', 'Bahrain', 'Kuwait', 'Saudi Arabia']

const stats = [
  { value: '6',    label: 'Services Offered' },
  { value: '6',    label: 'Countries Reached' },
  { value: '24h',  label: 'Response Time' },
]

export default function TrustBar() {
  return (
    <section style={{
      backgroundColor: '#1C1C2E',
      borderTop:       '1px solid rgba(255,255,255,0.06)',
      borderBottom:    '1px solid rgba(255,255,255,0.06)',
      padding:         '28px 60px',
    }}>
      <div style={{
        maxWidth:       '1200px',
        margin:         '0 auto',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '24px',
      }}>

        {/* ---- Left: Regions ---- */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '12px',
          flexWrap:   'wrap',
        }}>
          <span style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '12px',
            color:         '#888888',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            whiteSpace:    'nowrap',
          }}>
            Serving
          </span>

          {regions.map((region, i) => (
            <span key={region} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '14px',
                fontWeight: 500,
                color:      'rgba(255,255,255,0.7)',
                whiteSpace: 'nowrap',
              }}>
                {region}
              </span>
              {/* Dot separator — skip after last */}
              {i < regions.length - 1 && (
                <span style={{
                  width:           '3px',
                  height:          '3px',
                  borderRadius:    '50%',
                  backgroundColor: 'rgba(255,107,53,0.5)',
                  display:         'inline-block',
                  flexShrink:      0,
                }} />
              )}
            </span>
          ))}
        </div>

        {/* ---- Divider ---- */}
        <div style={{
          width:           '1px',
          height:          '32px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          flexShrink:      0,
        }} className="trust-divider" />

        {/* ---- Right: Stats ---- */}
        <div style={{
          display: 'flex',
          gap:     '40px',
          flexWrap: 'wrap',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize:   '22px',
                fontWeight: 700,
                color:      '#FF6B35',
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily:  'var(--font-body)',
                fontSize:    '12px',
                color:       '#888888',
                marginTop:   '4px',
                whiteSpace:  'nowrap',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}