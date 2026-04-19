'use client'

import React, { useState } from 'react'
import { CategoryBadge } from './CategoryBadge'

interface RelatedArticlesPreviewProps {
  article: any
  allArticles: any[]
  categoryColors: Record<string, string>
}

export function RelatedArticlesPreview({ article, allArticles, categoryColors }: RelatedArticlesPreviewProps) {
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
        const aTags = Array.isArray(a.tags)
          ? a.tags.map((t: any) => String(t).toLowerCase())
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

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Preview Card */}
      {isVisible && (
        <div className="absolute z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 transition-all duration-300 transform scale-95 opacity-0 animate-in fade-in zoom-in duration-200">
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
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryBadge
                        category={related.category}
                        categoryColors={categoryColors}
                      />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
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
