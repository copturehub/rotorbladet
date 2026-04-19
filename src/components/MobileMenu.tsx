'use client'

import { useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/kategori/nyheter', label: 'Nyheter', color: 'text-purple-600' },
  { href: '/kategori/utrustning', label: 'Utrustning', color: 'text-cyan-600' },
  { href: '/kategori/reglering', label: 'Reglering', color: 'text-orange-600' },
  { href: '/kategori/utbildning', label: 'Utbildning', color: 'text-emerald-600' },
  { href: '/kategori/affarer', label: 'Marknad', color: 'text-amber-600' },
  { href: '/verktyg', label: 'Verktyg', color: 'text-slate-700' },
  { href: '/prenumerera', label: 'Prenumerera', color: 'text-slate-700' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Meny"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 hover:bg-slate-100 transition-colors ${link.color}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
