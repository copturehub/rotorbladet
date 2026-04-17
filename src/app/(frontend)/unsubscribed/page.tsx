import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Avregistrerad - Rotorbladet',
  description: 'Du har avregistrerat dig från Rotorbladets nyhetsbrev.',
}

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100">
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Du är avregistrerad
        </h1>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Du kommer inte längre få nyhetsbrev från Rotorbladet. Vi är ledsna att se dig gå!
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors"
          >
            Tillbaka till startsidan
          </Link>
          <Link
            href="/prenumerera"
            className="inline-block text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Ångrat dig? Prenumerera igen
          </Link>
        </div>
      </div>
    </div>
  )
}
