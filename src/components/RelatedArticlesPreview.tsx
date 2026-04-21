'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CategoryBadge } from './CategoryBadge'

interface RelatedArticlesPreviewProps {
  article: any
  allArticles: any[]
  categoryColors: Record<string, string>
}

export function RelatedArticlesPreview({
  article,
  allArticles,
  categoryColors,
}: RelatedArticlesPreviewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({})
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showPopup = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const goUp = spaceBelow < 260 && spaceAbove > spaceBelow
      setPopupStyle({
        position: 'fixed',
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 316)),
        width: Math.min(300, window.innerWidth - 16),
        ...(goUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
        zIndex: 9999,
      })
    }
    setIsVisible(true)
  }

  // Find related articles (same category or similar tags)
  const relatedArticles = React.useMemo(() => {
    if (!article) return []

    const articleCategory = article.category?.toLowerCase()
    const articleTags = Array.isArray(article.tags)
      ? article.tags.map((t: any) => String(t).toLowerCase().trim())
      : []

    return allArticles
      .filter((a: any) => a.id !== article.id)
      .map((a: any) => {
        let score = 0
        const aCategory = a.category?.toLowerCase()
        const aTags = Array.isArray(a.tags)
          ? a.tags.map((t: any) => String(t).toLowerCase().trim())
          : []

        // Category match
        if (aCategory === articleCategory) score += 3

        // Tag matches
        const commonTags = aTags.filter((t: string) => articleTags.includes(t))
        score += commonTags.length * 2

        return { article: a, score }
      })
      .filter((item: any) => item.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 4)
      .map((item: any) => item.article)
  }, [article, allArticles])

  if (relatedArticles.length === 0) return null

  const popup =
    isVisible && mounted
      ? createPortal(
          <div
            style={popupStyle}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
          >
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Relaterade artiklar
            </div>
            <div className="space-y-3">
              {relatedArticles.map((related: any) => (
                <a
                  key={related.id}
                  href={related.original_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    {related.cover_url && (
                      <img
                        src={related.cover_url}
                        alt={related.title}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1">
                        <CategoryBadge
                          category={related.category}
                          categoryColors={categoryColors}
                        />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div
      className="relative border-t border-slate-100"
      onMouseEnter={showPopup}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        ref={btnRef}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          isVisible ? setIsVisible(false) : showPopup()
        }}
        className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold transition-colors ${isVisible ? 'bg-purple-50 text-purple-600' : 'text-slate-400 hover:bg-purple-50 hover:text-purple-600'}`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        {relatedArticles.length} relaterade artiklar
      </button>
      {popup}
    </div>
  )
}
