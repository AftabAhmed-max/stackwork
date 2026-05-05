/* ============================================
   PLEXUS BACKGROUND
   - Fixed behind all content globally
   - Cyan, orange and purple glowing nodes
   - Triangulated polygon connections
   - Slowly morphing and drifting
   ============================================ */
'use client'

import { useEffect, useRef } from 'react'

const COLORS = {
  orange: { r: 255, g: 107, b: 53  },
  cyan:   { r: 0,   g: 212, b: 255 },
  purple: { r: 139, g: 92,  b: 246 },
}

const COLOR_LIST = [COLORS.orange, COLORS.cyan, COLORS.purple]

type Node = {
  x:      number
  y:      number
  vx:     number
  vy:     number
  r:      number
  g:      number
  b:      number
  glow:   number
  glowDir: number
  size:   number
}

export default function PlexusBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let W = 0
    let H = 0

    const isMobile = window.innerWidth <= 768
    const COUNT    = isMobile ? 25 : 55
    const MAX_DIST = isMobile ? 120 : 180
    let nodes: Node[] = []

    const init = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight

      nodes = Array.from({ length: COUNT }, () => {
        const col = COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]
        return {
          x:       Math.random() * W,
          y:       Math.random() * H,
          vx:     (Math.random() - 0.5) * (isMobile ? 0.15 : 0.35),
          vy:     (Math.random() - 0.5) * (isMobile ? 0.15 : 0.35),
          r:       col.r,
          g:       col.g,
          b:       col.b,
          glow:    0.3 + Math.random() * 0.7,
          glowDir: Math.random() > 0.5 ? 1 : -1,
          size:    1.5 + Math.random() * 2,
        }
      })
    }

    init()
    window.addEventListener('resize', init)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      /* Update nodes */
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1

        /* Pulse glow */
        n.glow += n.glowDir * 0.008
        if (n.glow > 1)   { n.glow = 1;   n.glowDir = -1 }
        if (n.glow < 0.2) { n.glow = 0.2; n.glowDir =  1 }
      }

      /* Draw connections + triangles */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x
          const dy   = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_DIST) {
            const t     = 1 - dist / MAX_DIST
            const alpha = t * 0.2

            /* Line */
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${nodes[i].r},${nodes[i].g},${nodes[i].b},${alpha})`
            ctx.lineWidth   = t * 0.8
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()

            /* Find triangle — third node close to both */
            for (let k = j + 1; k < nodes.length; k++) {
              const dx2 = nodes[i].x - nodes[k].x
              const dy2 = nodes[i].y - nodes[k].y
              const dx3 = nodes[j].x - nodes[k].x
              const dy3 = nodes[j].y - nodes[k].y
              const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2)
              const d3  = Math.sqrt(dx3 * dx3 + dy3 * dy3)

              if (d2 < MAX_DIST && d3 < MAX_DIST) {
                /* Fill polygon */
                ctx.beginPath()
                ctx.moveTo(nodes[i].x, nodes[i].y)
                ctx.lineTo(nodes[j].x, nodes[j].y)
                ctx.lineTo(nodes[k].x, nodes[k].y)
                ctx.closePath()
                ctx.fillStyle = `rgba(${nodes[i].r},${nodes[i].g},${nodes[i].b},0.015)`
                ctx.fill()
              }
            }
          }
        }
      }

      /* Draw nodes with glow */
      for (const n of nodes) {
        /* Outer glow */
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 12)
        grad.addColorStop(0, `rgba(${n.r},${n.g},${n.b},${n.glow * 0.4})`)
        grad.addColorStop(1, `rgba(${n.r},${n.g},${n.b},0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, 12, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        /* Core dot */
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${n.r},${n.g},${n.b},${n.glow})`
        ctx.fill()
      }

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top:      0,
        left:     0,
        width:    '100vw',
        height:   '100vh',
        zIndex:   -1,
        pointerEvents: 'none',
      }}
    />
  )
}