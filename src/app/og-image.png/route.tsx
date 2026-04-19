import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(234,88,12,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Propeller icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ea580c, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C10.5 2 9.5 3.5 10 5L11 9C9 9.5 7.5 10.5 6.5 12L3 11C1.5 10.5 0.5 11.5 0.5 13C0.5 14.5 2 15.5 3.5 15L6.5 14C7 16 8.5 17.5 10.5 18.5L10 21.5C9.5 23 11 24 12.5 24C14 24 15 22.5 14.5 21L13.5 18C15.5 17.5 17 16 17.5 14L21 15C22.5 15.5 23.5 14 23.5 12.5C23.5 11 22 10 20.5 10.5L17.5 11.5C17 9.5 15.5 8 13.5 7L14 3.5C14.5 2 13.5 2 12 2Z" />
            </svg>
          </div>

          {/* Site name */}
          <span
            style={{
              fontSize: '72px',
              fontWeight: '900',
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            Rotorbladet
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(148,163,184,1)',
            fontWeight: '400',
            letterSpacing: '0.5px',
          }}
        >
          Sveriges nyhetsbrev för drönarbranschen
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(90deg, #ea580c, #f97316, #3b82f6)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
