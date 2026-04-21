'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { CategoryBadge } from '@/components/CategoryBadge'
import { SearchBar } from '@/components/SearchBar'
import { RelatedArticlesPreview } from '@/components/RelatedArticlesPreview'
import { AdminControls } from '@/components/AdminControls'
import { RelativeTime } from '@/components/RelativeTime'
import { ShareButton } from '@/components/ShareButton'
import { NewsTicker } from '@/components/NewsTicker'
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
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('rb-read') || '[]')
      setReadArticles(new Set(stored))
      const bm = JSON.parse(localStorage.getItem('rb-bookmarks') || '[]')
      setBookmarked(new Set(bm))
    } catch {}
  }, [])

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      try {
        localStorage.setItem('rb-bookmarks', JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

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
        `/api/articles/load-more?limit=${PAGE_SIZE}&page=${Math.floor(loadedCount / PAGE_SIZE) + 1}`,
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
      await fetch(`/api/articles/${articleId}/track-click`, { method: 'POST' })
    } catch {}
  }

  return (
    <>
      {/* 1. ANIMATED NEWS TICKER */}
      <NewsTicker articles={allLoadedArticles.slice(0, 10)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2. NEWSLETTER HERO */}
        <section className="mb-8 rounded-2xl overflow-hidden relative bg-emerald-600">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)' }}
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute -bottom-16 -left-8 w-56 h-56 bg-black/10 rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
          </div>
          <div className="relative px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/20 border border-white/30">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[11px] font-black text-white uppercase tracking-widest">
                  Gratis nyhetsbrev
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                Håll dig uppdaterad
              </h2>
              <p className="text-white/85 text-sm md:text-base max-w-sm mb-4">
                Veckans viktigaste drönarnyheter — varje fredag direkt i inkorgen.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-white/70 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  Varje fredag
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  100% gratis
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  Ingen spam
                </span>
              </div>
              {subscriberCount > 0 && (
                <p className="text-white/70 text-xs font-semibold mt-3">
                  {subscriberCount}+ prenumeranter
                </p>
              )}
            </div>
            <div className="w-full md:w-[420px] flex-shrink-0">
              <NewsletterSignup source="articles-hero" variant="hero" />
            </div>
          </div>
        </section>

        {/* 3. FEATURED - Hero magazine layout */}
        {featuredArticles.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Utvalda
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            {featuredArticles.length === 1 ? (
              <FeaturedHeroCard
                article={featuredArticles[0]}
                categoryColors={categoryColors}
                trackClick={trackClick}
                isAdmin={isAdmin}
                allArticles={allLoadedArticles}
                tall
              />
            ) : featuredArticles.length === 2 ? (
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

        {/* 4. TRENDING - horizontal scroll image cards */}
        {(() => {
          const trendList =
            trendingArticles.length >= 3 ? trendingArticles : allLoadedArticles.slice(0, 6)
          return trendList.length > 0 ? (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  🔥 Hett just nu
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                {trendList.map((article: any, i: number) => {
                  let source = article.source
                  if (!source && article.original_url) {
                    try {
                      source = new URL(article.original_url).hostname.replace(/^www\./, '')
                    } catch {
                      source = null
                    }
                  }
                  return (
                    <a
                      key={article.id}
                      href={article.original_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick(article.id)}
                      className="group relative flex-shrink-0 w-52 h-64 rounded-2xl overflow-hidden bg-slate-800 block"
                    >
                      {article.cover_url ? (
                        <img
                          src={article.cover_url}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-black shadow-lg ${
                            i === 0
                              ? 'bg-amber-400 text-white'
                              : i === 1
                                ? 'bg-slate-200 text-slate-700'
                                : i === 2
                                  ? 'bg-orange-400 text-white'
                                  : 'bg-white/20 text-white backdrop-blur-sm'
                          }`}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <CategoryBadge
                          category={article.category}
                          categoryColors={categoryColors}
                        />
                        <p className="text-white text-sm font-bold mt-1.5 leading-snug line-clamp-3">
                          {article.title}
                        </p>
                        {source && <p className="text-white/50 text-[10px] mt-1">{source}</p>}
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          ) : null
        })()}

        {/* 5. ARTICLES - full width 3-col grid */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Senaste nyheterna</h2>
            <SearchBar
              articles={allLoadedArticles}
              onFilteredArticles={(articles) => {
                setFilteredArticles(articles)
                setResultCount(articles.length)
              }}
            />
          </div>

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

          {resultCount !== loadedCount && (
            <p className="text-xs text-slate-500 mb-4">
              Visar {resultCount} av {loadedCount} artiklar
            </p>
          )}

          {filteredArticles.length > 0 ? (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
                {filteredArticles.map((article: any, idx: number) => {
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
                      key={article.id}
                      className="relative group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 break-inside-avoid mb-4"
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
                      <a
                        href={article.original_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col flex-1"
                        onClick={() => {
                          trackClick(article.id)
                          markAsRead(article.id)
                        }}
                      >
                        <div className="relative overflow-hidden bg-slate-100">
                          {article.cover_url ? (
                            <div
                              className={`relative w-full ${
                                idx % 7 === 0
                                  ? 'h-64'
                                  : idx % 5 === 0
                                    ? 'h-52'
                                    : idx % 3 === 0
                                      ? 'h-48'
                                      : 'h-40'
                              }`}
                            >
                              <Image
                                src={article.cover_url}
                                alt={article.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-28 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                              <svg
                                className="w-8 h-8 text-slate-300"
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
                          {readArticles.has(article.id) && (
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                          )}
                          {/* NEW badge for articles < 6 hours old */}
                          {article.publishedAt &&
                            !readArticles.has(article.id) &&
                            (() => {
                              const ageMs = Date.now() - new Date(article.publishedAt).getTime()
                              return ageMs < 6 * 60 * 60 * 1000 ? (
                                <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow">
                                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                  Ny
                                </span>
                              ) : null
                            })()}
                        </div>
                        <div className="flex flex-col flex-1 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryBadge
                              category={article.category}
                              categoryColors={categoryColors}
                            />
                            {article.publishedAt && (
                              <RelativeTime dateString={article.publishedAt} />
                            )}
                            {readArticles.has(article.id) && (
                              <span className="ml-auto text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                ✓ Läst
                              </span>
                            )}
                          </div>
                          <h3
                            className={`text-base font-bold mb-2 leading-snug transition-colors ${
                              readArticles.has(article.id)
                                ? 'text-slate-400'
                                : 'text-slate-900 group-hover:text-slate-700'
                            }`}
                          >
                            {article.title}
                          </h3>
                          {article.summary && (
                            <p className="text-slate-500 text-sm leading-relaxed mb-3 flex-1 line-clamp-3">
                              {article.summary}
                            </p>
                          )}
                          {source && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 pt-3 mt-auto border-t border-slate-100">
                              <span className="font-medium">{source}</span>
                              <span className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors font-semibold">
                                Läs mer →
                              </span>
                            </div>
                          )}
                        </div>
                      </a>
                      <div
                        className="flex items-center justify-between px-3 pb-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <ShareButton url={article.original_url || ''} title={article.title} />
                          <button
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className={`p-1.5 rounded-lg transition-colors text-xs ${
                              bookmarked.has(article.id)
                                ? 'text-amber-500 bg-amber-50'
                                : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                            title={bookmarked.has(article.id) ? 'Ta bort bokmärke' : 'Spara'}
                          >
                            <svg
                              className="w-4 h-4"
                              fill={bookmarked.has(article.id) ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          </button>
                        </div>
                        <RelatedArticlesPreview
                          article={article}
                          allArticles={allLoadedArticles}
                          categoryColors={categoryColors}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {loadedCount < totalArticles && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-full transition-all shadow-lg"
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
                      <>Ladda fler nyheter ({totalArticles - loadedCount} kvar)</>
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
        </section>
      </main>
    </>
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
        tall ? 'h-[360px] md:h-[440px]' : 'h-[195px]'
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
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
