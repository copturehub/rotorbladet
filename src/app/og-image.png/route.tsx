import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  const logoData = await readFile(path.join(process.cwd(), 'public/logo.png'))
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  const interFont = await fetch(
    new URL(
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ5hjp-Ek-_EeA.woff2',
    ),
  )
    .then((r) => r.arrayBuffer())
    .catch(() => null)

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
        fontFamily: interFont ? 'Inter' : 'system-ui, sans-serif',
        position: 'relative',
      }}
    >
      {/* Glow effects */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 15% 85%, rgba(234,88,12,0.2) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(59,130,246,0.12) 0%, transparent 45%)',
          display: 'flex',
        }}
      />

      {/* Logo + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '28px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoBase64} width={96} height={96} alt="logo" style={{ borderRadius: '50%' }} />
        <span
          style={{
            fontSize: '80px',
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
          color: 'rgba(148,163,184,0.9)',
          fontWeight: '400',
          letterSpacing: '0.3px',
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
    {
      width: 1200,
      height: 630,
      fonts: interFont ? [{ name: 'Inter', data: interFont, style: 'normal', weight: 900 }] : [],
    },
  )
}
