'use client'

import React, { useState } from 'react'
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

  // Find related articles (same category or similar tags)
  const relatedArticles = React.useMemo(() => {
    if (!article) return []

    const articleCategory = article.category?.toLowerCase()
    const articleTags = Array.isArray(article.tags)
      ? article.tags.map((t: any) => String(t).toLowerCase())
      : []

    return allArticles
      .filter((a: any) => a.id !== article.id)
      .map((a: any) => {
        let score = 0
        const aCategory = a.category?.toLowerCase()
        const aTags = Array.isArray(a.tags) ? a.tags.map((t: any) => String(t).toLowerCase()) : []

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

  return (
    <div
      className="relative border-t border-slate-100"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Trigger button */}
      <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors">
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

      {/* Preview Card */}
      {isVisible && (
        <div className="absolute bottom-full left-0 right-0 z-50 w-full bg-white rounded-t-2xl shadow-2xl border border-slate-200 border-b-0 p-4">
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
                      <CategoryBadge category={related.category} categoryColors={categoryColors} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                      {related.title}
                    </h4>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
