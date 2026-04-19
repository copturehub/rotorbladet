'use client'

import React, { useState } from 'react'
import { CategoryBadge } from '@/components/CategoryBadge'
import { SearchBar } from '@/components/SearchBar'
import { RelatedArticlesPreview } from '@/components/RelatedArticlesPreview'
import { AdminControls } from '@/components/AdminControls'
import { useAdmin } from '@/hooks/useAdmin'

interface ArticlesSectionProps {
  initialArticles: any[]
  featuredArticles?: any[]
  trendingArticles?: any[]
  categoryColors: Record<string, string>
}

export function ArticlesSection({
  initialArticles,
  featuredArticles = [],
  trendingArticles = [],
  categoryColors,
}: ArticlesSectionProps) {
  const [filteredArticles, setFilteredArticles] = useState(initialArticles)
  const [resultCount, setResultCount] = useState(initialArticles.length)
  const { isAdmin } = useAdmin()

  const trackClick = async (articleId: string) => {
    try {
      await fetch(`/api/articles/${articleId}/track-click`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Utvalda artiklar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article: any) => (
              <div
                key={article.id}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                {isAdmin && (
                  <AdminControls
                    articleId={article.id}
                    isFeatured={article.featured || false}
                    onFeaturedToggle={() => {
                      // Refresh page to update UI
                      window.location.reload()
                    }}
                    onDelete={() => {
                      // Handle delete - for now just reload
                      window.location.reload()
                    }}
                    onEdit={() => {
                      // Open admin edit page
                      window.location.href = `/admin/collections/articles/${article.id}`
                    }}
                  />
                )}
                <a
                  href={article.original_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col flex-1"
                  onClick={() => trackClick(article.id)}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {article.cover_url && (
                    <div className="relative overflow-hidden bg-slate-100">
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="relative flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryBadge category={article.category} categoryColors={categoryColors} />
                      {article.publishedAt && (
                        <time className="text-xs text-slate-500 font-medium">
                          {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </time>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-purple-700 transition-colors">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                        {article.summary}
                      </p>
                    )}
                    {(() => {
                      let source = article.source
                      if (!source && article.original_url) {
                        try {
                          source = new URL(article.original_url).hostname.replace(/^www\./, '')
                        } catch {
                          source = null
                        }
                      }
                      return source ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 mt-auto border-t border-slate-100">
                          <span>Källa:</span>
                          <span className="font-semibold text-slate-700">{source}</span>
                          <span className="ml-auto text-purple-600 group-hover:text-purple-800 transition-colors">
                            Läs mer →
                          </span>
                        </div>
                      ) : null
                    })()}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Section */}
      {trendingArticles.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.45-.412-1.725a1 1 0 00-1.93-.265c-.095.37-.187.783-.227 1.18-.04.393-.043.817.04 1.245.083.428.27.864.633 1.215.36.349.882.57 1.427.57.545 0 1.068-.221 1.428-.57.363-.35.55-.787.633-1.215.083-.428.08-.852.04-1.245-.04-.397-.132-.81-.227-1.18a1 1 0 00-1.93.265c-.014.275-.084 1.045-.412 1.725-.28.58-.615 1.02-.945 1.067a31.36 31.36 0 00-.613-3.58c-.226-.966-.506-1.93-.84-2.734a6.738 6.738 0 00-.57-1.116c-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385c-.095.37-.187.783-.227 1.18-.04.393-.043.817.04 1.245.083.428.27.864.633 1.215.36.349.882.57 1.427.57.545 0 1.068-.221 1.428-.57.363-.35.55-.787.633-1.215.083-.428.08-.852.04-1.245-.04-.397-.132-.81-.227-1.18a1 1 0 00-1.93.265c-.014.275-.084 1.045-.412 1.725-.28.58-.615 1.02-.945 1.067a31.36 31.36 0 00-.613-3.58c-.226-.966-.506-1.93-.84-2.734a6.738 6.738 0 00-.57-1.116c-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385c-.095.37-.187.783-.227 1.18-.04.393-.043.817.04 1.245.083.428.27.864.633 1.215.36.349.882.57 1.427.57.545 0 1.068-.221 1.428-.57.363-.35.55-.787.633-1.215.083-.428.08-.852.04-1.245-.04-.397-.132-.81-.227-1.18a1 1 0 00-1.93.265c-.014.275-.084 1.045-.412 1.725-.28.58-.615 1.02-.945 1.067a31.36 31.36 0 00-.613-3.58c-.226-.966-.506-1.93-.84-2.734a6.738 6.738 0 00-.57-1.116c-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385c-.095.37-.187.783-.227 1.18-.04.393-.043.817.04 1.245.083.428.27.864.633 1.215.36.349.882.57 1.427.57.545 0 1.068-.221 1.428-.57.363-.35.55-.787.633-1.215.083-.428.08-.852.04-1.245-.04-.397-.132-.81-.227-1.18a1 1 0 00-1.93.265c-.014.275-.084 1.045-.412 1.725-.28.58-.615 1.02-.945 1.067a31.36 31.36 0 00-.613-3.58c-.226-.966-.506-1.93-.84-2.734a6.738 6.738 0 00-.57-1.116c-.208-.322-.477-.65-.822-.88a1 1 0 00-1.45.385z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Mest lästa
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingArticles.map((article: any) => (
              <a
                key={article.id}
                href={article.original_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 hover:border-amber-300/50 hover:shadow-lg transition-all"
                onClick={() => trackClick(article.id)}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-black text-amber-600">
                    #{(article as any).clickCount || 0}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={article.category} categoryColors={categoryColors} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {article.title}
                  </h4>
                </div>
                <svg
                  className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Senaste nyheterna
          </h2>
          <p className="text-slate-600 mt-2">Handplockade artiklar från hela drönarbranschen</p>
        </div>
        <SearchBar
          articles={initialArticles}
          onFilteredArticles={(articles) => {
            setFilteredArticles(articles)
            setResultCount(articles.length)
          }}
        />
      </div>

      {filteredArticles.length > 0 ? (
        <>
          {resultCount !== initialArticles.length && (
            <div className="mb-6 text-sm text-slate-600">
              Visar {resultCount} av {initialArticles.length} artiklar
            </div>
          )}
          <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredArticles.map((article: any) => (
              <div
                key={article.id}
                className="masonry-item relative group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 break-inside-avoid mb-6"
              >
                {isAdmin && (
                  <AdminControls
                    articleId={article.id}
                    isFeatured={article.featured || false}
                    onFeaturedToggle={() => {
                      window.location.reload()
                    }}
                    onDelete={() => {
                      window.location.reload()
                    }}
                    onEdit={() => {
                      window.location.href = `/admin/collections/articles/${article.id}`
                    }}
                  />
                )}
                <a
                  href={article.original_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col flex-1"
                  onClick={() => trackClick(article.id)}
                >
                  {article.cover_url && (
                    <div className="relative overflow-hidden bg-slate-100">
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryBadge category={article.category} categoryColors={categoryColors} />
                      {article.publishedAt && (
                        <time className="text-xs text-slate-500 font-medium">
                          {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </time>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-slate-700 transition-colors">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                        {article.summary}
                      </p>
                    )}
                    {(() => {
                      let source = article.source
                      if (!source && article.original_url) {
                        try {
                          source = new URL(article.original_url).hostname.replace(/^www\./, '')
                        } catch {
                          source = null
                        }
                      }
                      return source ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 mt-auto border-t border-slate-100">
                          <span>Källa:</span>
                          <span className="font-semibold text-slate-700">{source}</span>
                          <span className="ml-auto text-slate-400 group-hover:text-slate-900 transition-colors">
                            Läs mer →
                          </span>
                        </div>
                      ) : null
                    })()}
                  </div>
                </a>
                <RelatedArticlesPreview
                  article={article}
                  allArticles={initialArticles}
                  categoryColors={categoryColors}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="inline-block p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-lg">
              {resultCount === 0
                ? 'Inga artiklar matchade din sökning.'
                : 'Inga artiklar publicerade än.'}
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
