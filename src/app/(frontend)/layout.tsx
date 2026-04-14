import React from 'react'
import '../globals.css'

export const metadata = {
  description: 'Sveriges ledande nyhetssajt för drönarbranschen',
  title: 'Rotorbladet.se - Drönar Nyheter',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
