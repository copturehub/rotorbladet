'use client'

import { useEffect, useState } from 'react'

type Theme = 'modern' | 'tidning' | 'blueprint' | 'wired'

const themes: { id: Theme; name: string; description: string; emoji: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Ren & minimal', emoji: '✨' },
  { id: 'tidning', name: 'Tidning', description: 'Klassisk svensk press', emoji: '📰' },
  { id: 'blueprint', name: 'Blueprint', description: 'Teknisk skiss', emoji: '📐' },
  { id: 'wired', name: 'Wired 90s', description: 'Retro-futurism', emoji: '⚡' },
]

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('modern')
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = (localStorage.getItem('rotorbladet-theme') as Theme) || 'modern'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('rotorbladet-theme', newTheme)
    setOpen(false)
  }

  if (!mounted) return null

  const current = themes.find((t) => t.id === theme) || themes[0]

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {open && (
        <div className="mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden min-w-[240px]">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Välj tema
            </p>
          </div>
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left ${
                  theme === t.id ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-2xl">{t.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.description}</p>
                </div>
                {theme === t.id && (
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 bg-white rounded-full shadow-xl border border-slate-200 hover:shadow-2xl transition-all hover:scale-105"
        aria-label="Byt tema"
      >
        <span className="text-xl">{current.emoji}</span>
        <span className="text-sm font-semibold text-slate-900">{current.name}</span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  )
}
