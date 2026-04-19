'use client'

import React, { useState } from 'react'

interface NewsletterSignupProps {
  source?: string
  variant?: 'hero' | 'inline' | 'footer'
}

export default function NewsletterSignup({
  source = 'homepage-hero',
  variant = 'hero',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Read from DOM directly in case of autofill not triggering onChange
    const form = e.target as HTMLFormElement
    const input = form.querySelector('input[type="email"]') as HTMLInputElement
    const currentEmail = email || input?.value || ''
    if (!currentEmail) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, source }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Något gick fel')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Något gick fel')
    }
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2 w-full overflow-hidden">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.se"
            disabled={status === 'loading'}
            className="flex-1 min-w-0 w-0 px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-sm backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex-shrink-0 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? '...' : 'Skicka'}
          </button>
        </div>
        {message && (
          <p
            className={`mt-2 text-xs font-medium ${
              status === 'success' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-2 text-xs text-white/40">Kostnadsfritt. Avregistrera när du vill.</p>
      </form>
    )
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.se"
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? 'Skickar...' : 'Prenumerera'}
          </button>
        </div>
        {message && (
          <p
            className={`mt-3 text-sm ${status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}
      </form>
    )
  }

  // footer variant
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="din@email.se"
        disabled={status === 'loading'}
        className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === 'loading' ? '...' : 'Prenumerera'}
      </button>
      {message && (
        <p className={`mt-2 text-xs ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
