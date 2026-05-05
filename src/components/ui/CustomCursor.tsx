/* ============================================
   CUSTOM CURSOR — Spotlight
   - Soft radial glow follows mouse exactly
   - Desktop only (touch devices excluded)
   - Invisible until mouse first moves
   - Glow intensifies on hover over links/buttons
   ============================================ */
'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const spotRef               = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(true)

  useEffect(() => {
    /* Only show on non-touch / hover-capable devices */
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setIsTouch(false)

    const onMove = (e: MouseEvent) => {
      if (!spotRef.current) return
      spotRef.current.style.left    = `${e.clientX}px`
      spotRef.current.style.top     = `${e.clientY}px`
      spotRef.current.style.opacity = '1'
    }

    const onEnter = () => {
      if (!spotRef.current) return
      spotRef.current.style.width      = '160px'
      spotRef.current.style.height     = '160px'
      spotRef.current.style.marginLeft = '-80px'
      spotRef.current.style.marginTop  = '-80px'
    }

    const onLeave = () => {
      if (!spotRef.current) return
      spotRef.current.style.width      = '120px'
      spotRef.current.style.height     = '120px'
      spotRef.current.style.marginLeft = '-60px'
      spotRef.current.style.marginTop  = '-60px'
    }

    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    attachHoverListeners()

    const observer = new MutationObserver(attachHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  /* ---- Never render on touch devices ---- */
  if (isTouch) return null

  return (
    <div
      ref={spotRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '120px',
        height:        '120px',
        marginLeft:    '-60px',
        marginTop:     '-60px',
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(255,107,53,0.35) 0%, rgba(255,107,53,0.12) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex:        99998,
        opacity:       0,
        transition:    'width 0.3s ease, height 0.3s ease, margin 0.3s ease',
        willChange:    'left, top',
      }}
    />
  )
}