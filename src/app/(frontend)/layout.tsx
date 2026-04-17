import React from 'react'
import '../globals.css'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export const metadata = {
  description: 'Sveriges ledande nyhetssajt för drönarbranschen',
  title: 'Rotorbladet.se - Drönar Nyheter',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="sv" data-theme="modern" suppressHydrationWarning>
      <head>
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
      </head>
      <body>
        <main>{children}</main>
        <ThemeSwitcher />
      </body>
    </html>
  )
}
