import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Kunde inte avregistrera - Rotorbladet',
}

export default function UnsubscribeErrorPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Kunde inte avregistrera
        </h1>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Länken är ogiltig eller har gått ut. Kontakta oss på{' '}
          <a href="mailto:gustav@copture.com" className="text-slate-900 font-semibold underline">
            gustav@copture.com
          </a>{' '}
          så hjälper vi dig.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors"
        >
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  )
}
