'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface SearchBarProps {
  articles: any[]
  onFilteredArticles: (articles: any[]) => void
}

export function SearchBar({ articles, onFilteredArticles }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const filterArticles = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        onFilteredArticles(articles)
        return
      }

      const lowerQuery = searchQuery.toLowerCase()
      const filtered = articles.filter((article) => {
        const title = article.title?.toLowerCase() || ''
        const summary = article.summary?.toLowerCase() || ''
        const category = article.category?.toLowerCase() || ''
        const source = article.source?.toLowerCase() || ''
        const tags = Array.isArray(article.tags)
          ? article.tags.map((t: any) => t.toLowerCase?.() || String(t).toLowerCase()).join(' ')
          : ''

        return (
          title.includes(lowerQuery) ||
          summary.includes(lowerQuery) ||
          category.includes(lowerQuery) ||
          source.includes(lowerQuery) ||
          tags.includes(lowerQuery)
        )
      })

      onFilteredArticles(filtered)
    },
    [articles, onFilteredArticles],
  )

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      filterArticles(query)
    }, 150)

    return () => clearTimeout(debounceTimer)
  }, [query, filterArticles])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isFocused) {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused])

  const handleClear = () => {
    setQuery('')
    onFilteredArticles(articles)
  }

  return (
    <div className="relative w-full max-w-md">
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Sök artiklar... (press /)"
          className="w-full px-4 py-2.5 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
