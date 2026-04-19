import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Rotorbladet – Drönnyheter från Sverige och världen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
            }}
          >
            ✦
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            Rotorbladet
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Drönnyheter från Sverige och världen
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 18,
            color: '#f97316',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          rotorbladet.se
        </div>
      </div>
    ),
    size,
  )
}
