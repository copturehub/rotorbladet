import React from 'react'
import '../globals.css'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import type { Metadata } from 'next'

const baseUrl = 'https://rotorbladet.se'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Rotorbladet – Drönnyheter från Sverige och världen',
    template: '%s | Rotorbladet',
  },
  description:
    'Rotorbladet aggregerar de senaste nyheterna om drönare, UAV och drönarindustrin i Sverige och världen.',
  keywords: ['drönare', 'UAV', 'drönnyheter', 'drönarindustrin', 'drönarteknik', 'Sverige'],
  authors: [{ name: 'Rotorbladet', url: baseUrl }],
  creator: 'Rotorbladet',
  publisher: 'Rotorbladet',
  alternates: {
    canonical: baseUrl,
    types: {
      'application/rss+xml': `${baseUrl}/api/rss`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: baseUrl,
    siteName: 'Rotorbladet',
    title: 'Rotorbladet – Drönnyheter från Sverige och världen',
    description:
      'Rotorbladet aggregerar de senaste nyheterna om drönare, UAV och drönarindustrin i Sverige och världen.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Rotorbladet – Drönnyheter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotorbladet – Drönnyheter från Sverige och världen',
    description:
      'Rotorbladet aggregerar de senaste nyheterna om drönare, UAV och drönarindustrin i Sverige och världen.',
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="sv" data-theme="modern" suppressHydrationWarning>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" href="/favicon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Serif+4:ital,wght@0,200..900;1,200..900&family=Oswald:wght@200..700&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@300..700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Inter:wght@100..900&family=Archivo+Black&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('rotorbladet-theme') || 'modern';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
        <script defer data-domain="rotorbladet.se" src="https://plausible.io/js/script.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then((registration) => {
                    console.log('SW registered:', registration);
                  }).catch((error) => {
                    console.log('SW registration failed:', error);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <main>{children}</main>
        <ThemeSwitcher />
      </body>
    </html>
  )
}
