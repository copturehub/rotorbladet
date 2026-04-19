import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Rotorbladet – Drönnyheter från Sverige och världen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await fetch(new URL('/logo.png', 'https://rotorbladet.se')).then((res) =>
    res.arrayBuffer(),
  )
  const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`

  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: '0 80px',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #f97316, #ea580c, #f97316)',
          display: 'flex',
        }}
      />

      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <img src={logoSrc} width={72} height={72} style={{ objectFit: 'contain' }} />
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-3px',
            display: 'flex',
          }}
        >
          Rotorbladet
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 30,
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: 800,
          lineHeight: 1.4,
          display: 'flex',
        }}
      >
        Drönnyheter från Sverige och världen
      </div>

      {/* URL pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(249,115,22,0.15)',
          border: '1px solid rgba(249,115,22,0.4)',
          borderRadius: 999,
          padding: '10px 28px',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#f97316',
            display: 'flex',
          }}
        />
        <div
          style={{
            fontSize: 20,
            color: '#f97316',
            fontWeight: 700,
            letterSpacing: '2px',
            display: 'flex',
          }}
        >
          ROTORBLADET.SE
        </div>
      </div>
    </div>,
    size,
  )
}
