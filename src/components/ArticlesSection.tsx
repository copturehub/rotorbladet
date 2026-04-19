'use client'

import React, { useState, useEffect } from 'react'
import { CategoryBadge } from '@/components/CategoryBadge'
import { SearchBar } from '@/components/SearchBar'
import { RelatedArticlesPreview } from '@/components/RelatedArticlesPreview'
import { AdminControls } from '@/components/AdminControls'
import { RelativeTime } from '@/components/RelativeTime'
import { ShareButton } from '@/components/ShareButton'
import NewsletterSignup from '@/components/NewsletterSignup'
import { useAdmin } from '@/hooks/useAdmin'

interface ArticlesSectionProps {
  initialArticles: any[]
  totalArticles?: number
  featuredArticles?: any[]
  trendingArticles?: any[]
  categoryColors: Record<string, string>
  subscriberCount?: number
}

const PAGE_SIZE = 20

export function ArticlesSection({
  initialArticles,
  totalArticles = initialArticles.length,
  featuredArticles = [],
  trendingArticles = [],
  categoryColors,
  subscriberCount = 0,
}: ArticlesSectionProps) {
  const [allLoadedArticles, setAllLoadedArticles] = useState(initialArticles)
  const [filteredArticles, setFilteredArticles] = useState(initialArticles)
  const [resultCount, setResultCount] = useState(initialArticles.length)
  const [loadedCount, setLoadedCount] = useState(initialArticles.length)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('rb-read') || '[]')
      setReadArticles(new Set(stored))
    } catch {}
  }, [])

  const markAsRead = (id: string) => {
    setReadArticles((prev) => {
      const next = new Set(prev)
      next.add(id)
      try {
        localStorage.setItem('rb-read', JSON.stringify([...next].slice(-200)))
      } catch {}
      return next
    })
  }

  const categories = ['nyheter', 'utrustning', 'reglering', 'utbildning', 'marknad']
  const categoryLabels: Record<string, string> = {
    nyheter: 'Nyheter',
    utrustning: 'Utrustning',
    reglering: 'Reglering',
    utbildning: 'Utbildning',
    marknad: 'Marknad',
  }

  const loadMore = async () => {
    setIsLoadingMore(true)
    try {
      const res = await fetch(
        `/api/articles?limit=${PAGE_SIZE}&page=${Math.floor(loadedCount / PAGE_SIZE) + 1}`,
      )
      const data = await res.json()
      const newArticles = [...allLoadedArticles, ...data.docs]
      setAllLoadedArticles(newArticles)
      setFilteredArticles(newArticles)
      setLoadedCount(newArticles.length)
      setResultCount(newArticles.length)
    } catch (e) {
      console.error('Failed to load more articles', e)
    } finally {
      setIsLoadingMore(false)
    }
  }
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* FEATURED - Hero magazine layout */}
      {featuredArticles.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Utvalda
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {featuredArticles.length === 1 ? (
            /* Single featured - full width hero */
            <FeaturedHeroCard
              article={featuredArticles[0]}
              categoryColors={categoryColors}
              trackClick={trackClick}
              isAdmin={isAdmin}
              allArticles={allLoadedArticles}
            />
          ) : featuredArticles.length === 2 ? (
            /* Two featured - 60/40 split */
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3">
                <FeaturedHeroCard
                  article={featuredArticles[0]}
                  categoryColors={categoryColors}
                  trackClick={trackClick}
                  isAdmin={isAdmin}
                  allArticles={allLoadedArticles}
                  tall
                />
              </div>
              <div className="md:col-span-2">
                <FeaturedHeroCard
                  article={featuredArticles[1]}
                  categoryColors={categoryColors}
                  trackClick={trackClick}
                  isAdmin={isAdmin}
                  allArticles={allLoadedArticles}
                  tall
                />
              </div>
            </div>
          ) : (
            /* 3+ featured - large + 2 small */
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3">
                <FeaturedHeroCard
                  article={featuredArticles[0]}
                  categoryColors={categoryColors}
                  trackClick={trackClick}
                  isAdmin={isAdmin}
                  allArticles={allLoadedArticles}
                  tall
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-4">
                {featuredArticles.slice(1, 3).map((article: any) => (
                  <FeaturedHeroCard
                    key={article.id}
                    article={article}
                    categoryColors={categoryColors}
                    trackClick={trackClick}
                    isAdmin={isAdmin}
                    allArticles={allLoadedArticles}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Newsletter CTA - prominent but compact */}
      <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-6 py-5">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">Veckans drönarnyheter</p>
              <p className="text-slate-400 text-xs">Direkt i inkorgen. Gratis.</p>
            </div>
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <NewsletterSignup source="articles-banner" variant="inline" />
          </div>
          {subscriberCount > 0 && (
            <span className="flex-shrink-0 text-[11px] text-slate-500 whitespace-nowrap hidden md:block">
              {subscriberCount}+ läsare
            </span>
          )}
        </div>
      </div>

      {/* TWO COLUMN LAYOUT: articles + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN: articles grid */}
        <div className="lg:col-span-2">
          {/* Header + search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Senaste nyheterna
              </h2>
            </div>
            <SearchBar
              articles={allLoadedArticles}
              onFilteredArticles={(articles) => {
                setFilteredArticles(articles)
                setResultCount(articles.length)
              }}
            />
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            <button
              onClick={() => {
                setActiveCategory(null)
                setFilteredArticles(allLoadedArticles)
                setResultCount(allLoadedArticles.length)
              }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeCategory === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Alla
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const filtered =
                    activeCategory === cat
                      ? allLoadedArticles
                      : allLoadedArticles.filter((a: any) => a.category === cat)
                  const next = activeCategory === cat ? null : cat
                  setActiveCategory(next)
                  setFilteredArticles(filtered)
                  setResultCount(filtered.length)
                }}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {filteredArticles.length > 0 ? (
            <>
              {resultCount !== loadedCount && (
                <div className="mb-4 text-xs text-slate-500">
                  Visar {resultCount} av {loadedCount} artiklar
                </div>
              )}
              <div className="columns-1 md:columns-2 gap-5 space-y-5">
                {filteredArticles.map((article: any) => (
                  <div
                    key={article.id}
                    className="relative group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 break-inside-avoid mb-5"
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
                      <div className="relative overflow-hidden bg-slate-100">
                        {article.cover_url ? (
                          <img
                            src={article.cover_url}
                            alt={article.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <svg
                              className="w-10 h-10 text-slate-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CategoryBadge
                            category={article.category}
                            categoryColors={categoryColors}
                          />
                          {article.publishedAt && <RelativeTime dateString={article.publishedAt} />}
                          {readArticles.has(article.id) && (
                            <span className="ml-auto text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Läst
                            </span>
                          )}
                        </div>
                        <h3
                          className={`text-lg font-bold mb-2 leading-snug transition-colors ${
                            readArticles.has(article.id)
                              ? 'text-slate-400 group-hover:text-slate-500'
                              : 'text-slate-900 group-hover:text-slate-700'
                          }`}
                        >
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
                    <div
                      className="flex items-center justify-between px-4 pb-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ShareButton url={article.original_url || ''} title={article.title} />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          markAsRead(article.id)
                        }}
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        {readArticles.has(article.id) ? '✓ Läst' : 'Markera läst'}
                      </button>
                    </div>
                    <RelatedArticlesPreview
                      article={article}
                      allArticles={allLoadedArticles}
                      categoryColors={categoryColors}
                    />
                  </div>
                ))}
              </div>

              {/* Load more button */}
              {loadedCount < totalArticles && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-full transition-all"
                  >
                    {isLoadingMore ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Laddar...
                      </>
                    ) : (
                      <>Ladda fler ({totalArticles - loadedCount} kvar)</>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500">
                {resultCount === 0
                  ? 'Inga artiklar matchade din sökning.'
                  : 'Inga artiklar publicerade än.'}
              </p>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Trending */}
          {trendingArticles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Trending
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <ol className="space-y-1">
                {trendingArticles.map((article: any, i: number) => (
                  <li key={article.id}>
                    <a
                      href={article.original_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick(article.id)}
                      className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 group transition-colors"
                    >
                      <span
                        className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black ${
                          i === 0
                            ? 'bg-amber-400 text-white'
                            : i === 1
                              ? 'bg-slate-200 text-slate-600'
                              : i === 2
                                ? 'bg-orange-200 text-orange-700'
                                : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <CategoryBadge
                          category={article.category}
                          categoryColors={categoryColors}
                        />
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                          {article.title}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Newsletter widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Nyhetsbrev
              </span>
            </div>
            <h3 className="text-lg font-black mb-1">Veckans drönarnyheter</h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Noga utvalda nyheter. En gång i veckan. Ingen spam.
            </p>
            <NewsletterSignup source="sidebar" variant="footer" />
            {subscriberCount > 0 && (
              <p className="mt-3 text-[11px] text-slate-500">{subscriberCount}+ prenumeranter</p>
            )}
          </div>

          {/* Category links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Kategorier
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-1">
              {Object.entries(categoryLabels).map(([slug, label]) => (
                <a
                  key={slug}
                  href={`/kategori/${slug}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 group transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                    {label as string}
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-300 group-hover:text-slate-500"
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
        </aside>
      </div>
    </main>
  )
}

function FeaturedHeroCard({
  article,
  categoryColors,
  trackClick,
  isAdmin,
  allArticles,
  tall = false,
}: {
  article: any
  categoryColors: Record<string, string>
  trackClick: (id: string) => void
  isAdmin: boolean
  allArticles: any[]
  tall?: boolean
}) {
  let source = article.source
  if (!source && article.original_url) {
    try {
      source = new URL(article.original_url).hostname.replace(/^www\./, '')
    } catch {
      source = null
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-slate-900 ${
        tall ? 'h-[340px] md:h-[420px]' : 'h-[200px] md:h-[200px]'
      }`}
    >
      {isAdmin && (
        <AdminControls
          articleId={article.id}
          isFeatured={article.featured || false}
          onFeaturedToggle={() => window.location.reload()}
          onDelete={() => window.location.reload()}
          onEdit={() => {
            window.location.href = `/admin/collections/articles/${article.id}`
          }}
        />
      )}
      {article.cover_url && (
        <img
          src={article.cover_url}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <a
        href={article.original_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(article.id)}
        className="absolute inset-0 flex flex-col justify-end p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={article.category} categoryColors={categoryColors} />
          {article.publishedAt && (
            <span className="text-[11px] text-white/60 font-medium">
              {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          )}
          {source && <span className="ml-auto text-[11px] text-white/50">{source}</span>}
        </div>
        <h3
          className={`font-black text-white leading-snug group-hover:text-white/90 transition-colors ${
            tall ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
          }`}
        >
          {article.title}
        </h3>
        {tall && article.summary && (
          <p className="text-white/70 text-sm mt-2 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        )}
      </a>
    </div>
  )
}
