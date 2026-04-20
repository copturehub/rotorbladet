import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      {/* Orange glow bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(234,88,12,0.18)',
          filter: 'blur(80px)',
          display: 'flex',
        }}
      />
      {/* Blue glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(59,130,246,0.12)',
          filter: 'blur(80px)',
          display: 'flex',
        }}
      />

      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '24px' }}>
        {/* Propeller circle */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {/* 3-blade propeller SVG */}
          <svg width="58" height="58" viewBox="0 0 100 100" fill="none">
            {/* Blade 1 - top */}
            <ellipse cx="50" cy="28" rx="11" ry="26" fill="white" transform="rotate(0 50 50)" />
            {/* Blade 2 - bottom-right */}
            <ellipse cx="50" cy="28" rx="11" ry="26" fill="white" transform="rotate(120 50 50)" />
            {/* Blade 3 - bottom-left */}
            <ellipse cx="50" cy="28" rx="11" ry="26" fill="white" transform="rotate(240 50 50)" />
            {/* Center hub */}
            <circle cx="50" cy="50" r="7" fill="#c2410c" />
          </svg>
        </div>

        <span
          style={{
            fontSize: '84px',
            fontWeight: '900',
            color: '#ffffff',
            letterSpacing: '-3px',
            lineHeight: 1,
          }}
        >
          Rotorbladet
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: '26px',
          color: 'rgba(148,163,184,0.85)',
          fontWeight: '400',
          letterSpacing: '0.2px',
          display: 'flex',
        }}
      >
        Sveriges nyhetsbrev för drönarbranschen
      </div>

      {/* Bottom gradient bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '6px',
          background: 'linear-gradient(90deg, #ea580c, #f97316, #3b82f6)',
          display: 'flex',
        }}
      />
    </div>,
    { width: 1200, height: 630 },
  )
}
