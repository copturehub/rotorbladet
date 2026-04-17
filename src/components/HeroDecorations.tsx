'use client'

import { useEffect, useState } from 'react'

type Theme = 'modern' | 'tidning' | 'blueprint' | 'wired'

export function HeroDecorations() {
  const [theme, setTheme] = useState<Theme>('modern')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTheme = () => {
      const t = (document.documentElement.getAttribute('data-theme') as Theme) || 'modern'
      setTheme(t)
    }
    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  if (!mounted) return null
  if (theme === 'tidning') return <TidningDecorations />
  if (theme === 'blueprint') return <BlueprintDecorations />
  if (theme === 'wired') return <WiredDecorations />
  return null
}

/* ============================================
   TIDNING - Grönköpings Veckoblad möter Wired
   ============================================ */
function TidningDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Paper texture background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23noise)' opacity='0.5'/></svg>")`,
        }}
      />

      {/* Big halftone corner TL */}
      <svg className="absolute -top-10 -left-10 w-96 h-96 opacity-40" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="halftone-fade">
            <stop offset="0%" stopColor="#1a0f08" />
            <stop offset="100%" stopColor="#1a0f08" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="halftone-pattern"
            x="0"
            y="0"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="6" cy="6" r="2.5" fill="#1a0f08" />
          </pattern>
          <mask id="halftone-mask">
            <rect width="400" height="400" fill="url(#halftone-fade)" />
          </mask>
        </defs>
        <rect width="400" height="400" fill="url(#halftone-pattern)" mask="url(#halftone-mask)" />
      </svg>

      {/* Big halftone corner BR */}
      <svg className="absolute -bottom-10 -right-10 w-96 h-96 opacity-40" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="halftone-fade2">
            <stop offset="0%" stopColor="#8b1a1a" />
            <stop offset="100%" stopColor="#8b1a1a" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="halftone-pattern2"
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="7" cy="7" r="3" fill="#8b1a1a" />
          </pattern>
          <mask id="halftone-mask2">
            <rect
              width="400"
              height="400"
              fill="url(#halftone-fade2)"
              transform="translate(400 400) scale(-1 -1)"
            />
          </mask>
        </defs>
        <rect width="400" height="400" fill="url(#halftone-pattern2)" mask="url(#halftone-mask2)" />
      </svg>

      {/* Spinning red ink stamp */}
      <div className="absolute top-24 right-4 md:right-12 animate-stamp-rotate hidden sm:block">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <defs>
            <path
              id="stamp-circle"
              d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
            />
          </defs>
          <circle cx="80" cy="80" r="72" fill="none" stroke="#8b1a1a" strokeWidth="3" />
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="#8b1a1a"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text fontSize="13" fontWeight="900" fill="#8b1a1a" letterSpacing="3">
            <textPath href="#stamp-circle" startOffset="0">
              ★ EXKLUSIV ★ ROTORBLADET ★ NR. 42 ★ 2024 ★
            </textPath>
          </text>
          <text
            x="80"
            y="72"
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill="#8b1a1a"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            VECKANS
          </text>
          <text
            x="80"
            y="92"
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill="#8b1a1a"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TOPP 10
          </text>
        </svg>
      </div>

      {/* Hand-drawn drone - larger */}
      <div className="absolute bottom-16 left-4 md:left-12 animate-float hidden sm:block">
        <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
          <g stroke="#1a0f08" strokeWidth="2" strokeLinecap="round">
            <rect x="80" y="60" width="40" height="30" rx="3" fill="#faf6ed" />
            <line x1="80" y1="70" x2="30" y2="45" strokeWidth="3" />
            <line x1="120" y1="70" x2="170" y2="45" strokeWidth="3" />
            <line x1="80" y1="85" x2="30" y2="105" strokeWidth="3" />
            <line x1="120" y1="85" x2="170" y2="105" strokeWidth="3" />
            {/* Spinning propellers */}
            <g className="animate-spin-slow" style={{ transformOrigin: '30px 45px' }}>
              <ellipse cx="30" cy="45" rx="22" ry="4" fill="#1a0f08" opacity="0.3" />
            </g>
            <g className="animate-spin-slow" style={{ transformOrigin: '170px 45px' }}>
              <ellipse cx="170" cy="45" rx="22" ry="4" fill="#1a0f08" opacity="0.3" />
            </g>
            <g className="animate-spin-slow" style={{ transformOrigin: '30px 105px' }}>
              <ellipse cx="30" cy="105" rx="22" ry="4" fill="#1a0f08" opacity="0.3" />
            </g>
            <g className="animate-spin-slow" style={{ transformOrigin: '170px 105px' }}>
              <ellipse cx="170" cy="105" rx="22" ry="4" fill="#1a0f08" opacity="0.3" />
            </g>
            {/* Camera */}
            <circle cx="100" cy="75" r="4" fill="#1a0f08" />
            <line x1="100" y1="90" x2="100" y2="98" strokeWidth="2" />
          </g>
          <text
            x="100"
            y="130"
            textAnchor="middle"
            fontSize="11"
            fill="#1a0f08"
            fontStyle="italic"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Fig. 1 — Quadrocopter
          </text>
        </svg>
      </div>

      {/* Old-school laurels top-left */}
      <svg
        className="absolute top-20 left-4 md:left-10 w-16 md:w-24 h-16 md:h-24 hidden sm:block"
        viewBox="0 0 100 100"
        fill="none"
      >
        <g stroke="#1a0f08" strokeWidth="1.5">
          <path d="M 50 10 Q 30 30 20 55 Q 18 70 28 85" fill="none" />
          <path d="M 50 10 Q 70 30 80 55 Q 82 70 72 85" fill="none" />
          {/* Leaves */}
          {[20, 35, 50, 65, 80].map((y, i) => (
            <g key={i}>
              <ellipse
                cx={22 + i * 1.5}
                cy={y}
                rx="8"
                ry="3"
                transform={`rotate(-45 ${22 + i * 1.5} ${y})`}
              />
              <ellipse
                cx={78 - i * 1.5}
                cy={y}
                rx="8"
                ry="3"
                transform={`rotate(45 ${78 - i * 1.5} ${y})`}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Masthead style banner */}
      <div
        className="absolute top-0 left-0 right-0 border-b-4 border-double py-3 overflow-hidden z-10"
        style={{ borderColor: '#1a0f08', backgroundColor: '#faf6ed' }}
      >
        <div
          className="flex justify-between items-center max-w-7xl mx-auto px-8 text-xs font-bold uppercase tracking-widest"
          style={{ color: '#1a0f08', fontFamily: 'var(--font-accent)' }}
        >
          <span>Etabl. 2024</span>
          <span className="text-lg tracking-[0.3em]" style={{ fontFamily: 'var(--font-display)' }}>
            ★ ROTORBLADETS VECKOBLAD ★
          </span>
          <span>Nr. 42 · Pris 1 kr</span>
        </div>
      </div>

      {/* News ticker */}
      <div
        className="absolute top-14 left-0 right-0 border-b overflow-hidden py-2 z-10"
        style={{ borderColor: '#1a0f08', backgroundColor: '#f4efe6' }}
      >
        <div
          className="animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-wider"
          style={{ color: '#8b1a1a', fontFamily: 'var(--font-accent)' }}
        >
          <span className="mx-8">★ EXTRA! EXTRA!</span>
          <span className="mx-8">Rotorbladet rapporterar veckans drönarhändelser</span>
          <span className="mx-8">★ Ny reglering på väg från EU</span>
          <span className="mx-8">DJI-förbudet diskuteras</span>
          <span className="mx-8">★ Vädret idag: Blåsigt med inslag av drönare</span>
          <span className="mx-8">★ EXTRA! EXTRA!</span>
          <span className="mx-8">Rotorbladet rapporterar veckans drönarhändelser</span>
          <span className="mx-8">★ Ny reglering på väg från EU</span>
          <span className="mx-8">DJI-förbudet diskuteras</span>
          <span className="mx-8">★ Vädret idag: Blåsigt med inslag av drönare</span>
        </div>
      </div>

      {/* "Ny upplaga" stamp */}
      <div
        className="absolute bottom-12 right-4 md:right-20 px-3 md:px-4 py-1.5 md:py-2 border-4 transform rotate-12 text-xs md:text-sm font-black uppercase tracking-widest hidden sm:block"
        style={{
          color: '#8b1a1a',
          borderColor: '#8b1a1a',
          fontFamily: 'var(--font-accent)',
          backgroundColor: 'rgba(250, 246, 237, 0.9)',
        }}
      >
        Ny upplaga!
      </div>
    </div>
  )
}

/* ============================================
   BLUEPRINT - Technical drawing paradise
   ============================================ */
function BlueprintDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* BIG visible blueprint grid */}
      <svg
        className="absolute inset-0 w-full h-full animate-grid-draw"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-sm" width="25" height="25" patternUnits="userSpaceOnUse">
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="#7fc4e0"
              strokeWidth="0.5"
              opacity="0.4"
            />
          </pattern>
          <pattern id="grid-lg" width="125" height="125" patternUnits="userSpaceOnUse">
            <path
              d="M 125 0 L 0 0 0 125"
              fill="none"
              stroke="#7fc4e0"
              strokeWidth="1"
              opacity="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-sm)" />
        <rect width="100%" height="100%" fill="url(#grid-lg)" />
      </svg>

      {/* Huge technical drone drawing - centered and VISIBLE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 w-[320px] h-[320px] md:w-[500px] md:h-[500px]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 500"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <g stroke="#00e5ff" strokeWidth="1.5" fill="none">
            {/* Outer measurement */}
            <line x1="60" y1="40" x2="440" y2="40" strokeDasharray="4 3" />
            <line x1="60" y1="30" x2="60" y2="50" strokeWidth="2" />
            <line x1="440" y1="30" x2="440" y2="50" strokeWidth="2" />
            <text
              x="250"
              y="32"
              textAnchor="middle"
              fontSize="12"
              fill="#00e5ff"
              stroke="none"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Ø 850mm
            </text>

            {/* Central body */}
            <circle cx="250" cy="250" r="50" strokeWidth="2" />
            <circle cx="250" cy="250" r="42" strokeDasharray="3 2" />
            <circle cx="250" cy="250" r="30" />
            <line x1="220" y1="250" x2="280" y2="250" />
            <line x1="250" y1="220" x2="250" y2="280" />

            {/* Arms */}
            <line x1="250" y1="250" x2="110" y2="110" strokeWidth="4" />
            <line x1="250" y1="250" x2="390" y2="110" strokeWidth="4" />
            <line x1="250" y1="250" x2="110" y2="390" strokeWidth="4" />
            <line x1="250" y1="250" x2="390" y2="390" strokeWidth="4" />

            {/* Props */}
            {[
              [110, 110],
              [390, 110],
              [110, 390],
              [390, 390],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="45" strokeDasharray="4 3" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="35" />
                <circle cx={cx} cy={cy} r="8" fill="#00e5ff" />
                <line
                  x1={cx - 40}
                  y1={cy}
                  x2={cx + 40}
                  y2={cy}
                  strokeWidth="3"
                  className="animate-spin-slow"
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
                <line
                  x1={cx}
                  y1={cy - 40}
                  x2={cx}
                  y2={cy + 40}
                  strokeWidth="3"
                  className="animate-spin-slow"
                  style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: '-0.5s' }}
                />
              </g>
            ))}

            {/* Annotations */}
            <line x1="110" y1="110" x2="30" y2="60" strokeDasharray="1 2" />
            <text
              x="15"
              y="55"
              fontSize="11"
              fill="#00e5ff"
              stroke="none"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              MOTOR #01
            </text>

            <line x1="250" y1="200" x2="250" y2="130" strokeDasharray="1 2" />
            <text
              x="255"
              y="125"
              fontSize="11"
              fill="#00e5ff"
              stroke="none"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              FLIGHT CTRL
            </text>

            <line x1="300" y1="250" x2="370" y2="250" strokeDasharray="1 2" />
            <text
              x="375"
              y="248"
              fontSize="11"
              fill="#00e5ff"
              stroke="none"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              GPS MODULE
            </text>

            <line x1="250" y1="300" x2="250" y2="370" strokeDasharray="1 2" />
            <text
              x="255"
              y="385"
              fontSize="11"
              fill="#00e5ff"
              stroke="none"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              CAMERA 4K
            </text>

            {/* Corner details */}
            <g>
              <line x1="40" y1="250" x2="60" y2="250" strokeWidth="2" />
              <line x1="60" y1="110" x2="60" y2="390" />
              <text
                x="35"
                y="255"
                fontSize="10"
                fill="#00e5ff"
                stroke="none"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                280
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Animated compass TL */}
      <div className="absolute top-14 left-4 md:top-10 md:left-10 w-16 md:w-[120px]">
        <svg width="100%" height="100%" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="rgba(10, 37, 64, 0.5)"
            stroke="#00e5ff"
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
          {/* Degree marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="60"
              y1="10"
              x2="60"
              y2="15"
              stroke="#00e5ff"
              strokeWidth="2"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          <g className="animate-compass-spin" style={{ transformOrigin: '60px 60px' }}>
            <path d="M 60 15 L 66 60 L 60 105 L 54 60 Z" fill="#00e5ff" />
            <circle cx="60" cy="60" r="5" fill="#0a2540" stroke="#00e5ff" strokeWidth="2" />
          </g>
          <text
            x="60"
            y="10"
            textAnchor="middle"
            fontSize="10"
            fill="#00e5ff"
            fontWeight="700"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            N
          </text>
          <text
            x="60"
            y="118"
            textAnchor="middle"
            fontSize="10"
            fill="#00e5ff"
            fontWeight="700"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            S
          </text>
          <text
            x="115"
            y="64"
            textAnchor="middle"
            fontSize="10"
            fill="#00e5ff"
            fontWeight="700"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            E
          </text>
          <text
            x="5"
            y="64"
            textAnchor="middle"
            fontSize="10"
            fill="#00e5ff"
            fontWeight="700"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            W
          </text>
        </svg>
      </div>

      {/* Coordinates */}
      <div className="absolute top-4 right-4 text-[10px] md:text-xs font-mono text-cyan-300 bg-slate-900/70 px-2 md:px-3 py-1 border border-cyan-400/50">
        <span className="hidden md:inline">LAT 59.3293° N · LNG 18.0686° E</span>
        <span className="md:hidden">59.33°N</span>
      </div>

      {/* Scale ruler BL */}
      <div className="absolute bottom-20 left-4 md:left-10 text-cyan-300 hidden sm:block">
        <svg width="200" height="40" viewBox="0 0 200 40">
          <g stroke="#00e5ff" strokeWidth="1.5">
            <line x1="10" y1="20" x2="190" y2="20" />
            {[0, 25, 50, 75, 100].map((p, i) => (
              <g key={i}>
                <line x1={10 + i * 45} y1="15" x2={10 + i * 45} y2="25" strokeWidth="2" />
                <text
                  x={10 + i * 45}
                  y="38"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#00e5ff"
                  stroke="none"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {p}mm
                </text>
              </g>
            ))}
            {Array.from({ length: 18 }, (_, i) => (
              <line key={i} x1={10 + i * 10} y1="17" x2={10 + i * 10} y2="23" strokeWidth="0.5" />
            ))}
          </g>
          <text
            x="100"
            y="10"
            textAnchor="middle"
            fontSize="9"
            fill="#00e5ff"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            SKALA 1:1
          </text>
        </svg>
      </div>

      {/* Project info box BR */}
      <div
        className="absolute bottom-4 right-4 border border-dashed p-2 md:p-3 text-[10px] md:text-xs font-mono text-cyan-300 bg-slate-900/60 hidden sm:block"
        style={{ borderColor: '#00e5ff' }}
      >
        <div
          className="font-bold mb-1 border-b border-dashed pb-1"
          style={{ borderColor: '#00e5ff' }}
        >
          RITNING NR. RB-2024-001
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 mt-1">
          <span>Projekt:</span>
          <span>ROTORBLADET</span>
          <span>Version:</span>
          <span>1.0 BETA</span>
          <span>Datum:</span>
          <span>2024-04-17</span>
          <span>Ritad av:</span>
          <span>Redaktionen</span>
        </div>
      </div>

      {/* Crosshair corners */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60" />
    </div>
  )
}

/* ============================================
   WIRED 90s - Full tilt retro-futurism
   ============================================ */
function WiredDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Gradient mesh blobs - vivid colors */}
      <div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full mix-blend-screen blur-3xl animate-blob"
        style={{ backgroundColor: '#ff0099' }}
      />
      <div
        className="absolute top-20 -right-20 w-[500px] h-[500px] rounded-full mix-blend-screen blur-3xl animate-blob animation-delay-2000"
        style={{ backgroundColor: '#00ffcc' }}
      />
      <div
        className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full mix-blend-screen blur-3xl animate-blob animation-delay-4000"
        style={{ backgroundColor: '#ffcc00' }}
      />

      {/* Y2K floating shapes */}
      <div
        className="absolute top-20 left-[8%] w-16 h-16 border-4 animate-float-slow"
        style={{ borderColor: '#ff0099', transform: 'rotate(45deg)' }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-20 h-20 border-4 rounded-full animate-float-slow animation-delay-2000"
        style={{ borderColor: '#00ffcc' }}
      />
      <div
        className="absolute bottom-20 left-[18%] animate-float-slow animation-delay-4000"
        style={{
          width: 0,
          height: 0,
          borderLeft: '25px solid transparent',
          borderRight: '25px solid transparent',
          borderBottom: '40px solid #ffcc00',
        }}
      />
      <div
        className="absolute top-1/2 left-[4%] w-10 h-10 animate-float-slow animation-delay-1000"
        style={{ backgroundColor: '#00ffcc' }}
      />
      <div
        className="absolute bottom-[30%] right-[12%] text-5xl animate-float animation-delay-3000"
        style={{ color: '#ff0099' }}
      >
        ✦
      </div>
      <div
        className="absolute top-[25%] right-[22%] text-4xl animate-float animation-delay-1000"
        style={{ color: '#ffcc00' }}
      >
        ◆
      </div>
      <div
        className="absolute top-[60%] left-[7%] text-3xl animate-float animation-delay-2000"
        style={{ color: '#00ffcc' }}
      >
        ●
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines z-10" />

      {/* CRT flicker overlay */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, transparent 1px, transparent 2px)`,
        }}
      />

      {/* Top marquee */}
      <div
        className="absolute top-0 left-0 right-0 py-2 overflow-hidden z-20 border-b-4"
        style={{ backgroundColor: '#ff0099', borderColor: '#1a0033', color: '#ffffff' }}
      >
        <div
          className="animate-marquee whitespace-nowrap text-sm font-black uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-accent)' }}
        >
          <span className="mx-6">◆ NEWS FLASH ◆</span>
          <span className="mx-6">ROTORBLADET.EXE LOADED</span>
          <span className="mx-6">◆ TRANSMISSION ACTIVE ◆</span>
          <span className="mx-6">DRONE FEED ONLINE</span>
          <span className="mx-6">◆ SYSTEM 2024 ◆</span>
          <span className="mx-6">WELCOME USER</span>
          <span className="mx-6">◆ NEWS FLASH ◆</span>
          <span className="mx-6">ROTORBLADET.EXE LOADED</span>
          <span className="mx-6">◆ TRANSMISSION ACTIVE ◆</span>
          <span className="mx-6">DRONE FEED ONLINE</span>
          <span className="mx-6">◆ SYSTEM 2024 ◆</span>
          <span className="mx-6">WELCOME USER</span>
        </div>
      </div>

      {/* Bottom marquee (reverse) */}
      <div
        className="absolute bottom-0 left-0 right-0 py-2 overflow-hidden z-20 border-t-4"
        style={{ backgroundColor: '#00ffcc', borderColor: '#1a0033', color: '#1a0033' }}
      >
        <div
          className="animate-marquee whitespace-nowrap text-sm font-black uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-accent)', animationDirection: 'reverse' }}
        >
          <span className="mx-6">● WIRE SERVICE ●</span>
          <span className="mx-6">56K MODEM CONNECTED</span>
          <span className="mx-6">● DATA STREAM ●</span>
          <span className="mx-6">DOWNLOADING FUTURE...</span>
          <span className="mx-6">● WIRE SERVICE ●</span>
          <span className="mx-6">56K MODEM CONNECTED</span>
          <span className="mx-6">● DATA STREAM ●</span>
          <span className="mx-6">DOWNLOADING FUTURE...</span>
        </div>
      </div>

      {/* ASCII art TL */}
      <div
        className="absolute top-16 left-6 text-xs font-mono leading-tight z-10 hidden md:block"
        style={{ color: '#00ffcc' }}
      >
        <pre>{`   .  *   .
 *   . ROTORBLADET
   . * .    *
  *  cyberpunk
   .   drone   .`}</pre>
      </div>

      {/* Terminal TR */}
      <div
        className="absolute top-16 right-6 text-[10px] md:text-xs font-mono z-10 border-2 p-1.5 md:p-2 hidden sm:block"
        style={{
          color: '#ff0099',
          borderColor: '#ff0099',
          backgroundColor: 'rgba(26, 0, 51, 0.8)',
        }}
      >
        <div>&gt; BOOT SEQUENCE...OK</div>
        <div>&gt; LOADING MODULES...OK</div>
        <div>&gt; NETWORK..........OK</div>
        <div>
          &gt; DRONES...........<span style={{ color: '#00ffcc' }}>247</span>
        </div>
        <div>
          &gt; USERS............<span style={{ color: '#00ffcc' }}>42</span>
        </div>
        <div>
          <span className="animate-pulse">█</span> READY_
        </div>
      </div>

      {/* "HYPERLINK" badge */}
      <div
        className="absolute bottom-20 right-4 md:right-16 px-3 md:px-4 py-1.5 md:py-2 font-black text-base md:text-lg uppercase z-10 hidden sm:block"
        style={{
          backgroundColor: '#ffcc00',
          color: '#1a0033',
          transform: 'rotate(-5deg)',
          boxShadow: '6px 6px 0 #1a0033',
          fontFamily: 'var(--font-accent)',
        }}
      >
        WEB 2.0!!
      </div>

      {/* Pixel art stars */}
      {[
        { top: '15%', left: '45%' },
        { top: '30%', left: '30%' },
        { top: '70%', left: '50%' },
        { top: '50%', left: '85%' },
        { top: '80%', right: '30%' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-pulse"
          style={{ ...pos, color: '#ffffff', animationDelay: `${i * 0.3}s` }}
        >
          ✧
        </div>
      ))}
    </div>
  )
}
