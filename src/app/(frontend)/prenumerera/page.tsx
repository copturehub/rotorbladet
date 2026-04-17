import React from 'react'
import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata = {
  title: 'Prenumerera - Rotorbladet',
  description: 'Prenumerera på veckans viktigaste drönarnyheter direkt i din inkorg.',
}

export default function SubscribePage() {
  const benefits = [
    {
      icon: '📰',
      title: 'Veckans toppnyheter',
      description: 'Noga utvalda artiklar från hela drönarbranschen, sammanfattade på svenska.',
    },
    {
      icon: '⚖️',
      title: 'Regleringsuppdateringar',
      description: 'Håll dig uppdaterad om nya lagar, BVLOS, drönar-ID och mer.',
    },
    {
      icon: '🚁',
      title: 'Nya drönare & teknik',
      description: 'De senaste lanseringarna inom konsumentdrönare, kommersiella och försvarsdrönare.',
    },
    {
      icon: '💼',
      title: 'Branschaffärer',
      description: 'Förvärv, investeringar och partnerskap som formar drönarbranschen.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
            Rotorbladet
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
            Prenumerera på{' '}
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Rotorbladet
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ett mail i veckan. Noga utvalda drönarnyheter. Kostnadsfritt. Ingen spam.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl">
          <div className="max-w-xl mx-auto">
            <NewsletterSignup source="prenumerera-page" variant="hero" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="p-6 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-semibold"
          >
            ← Tillbaka till startsidan
          </Link>
        </div>
      </main>
    </div>
  )
}
