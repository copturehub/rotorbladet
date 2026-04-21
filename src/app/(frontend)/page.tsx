import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import { ArticlesSection } from '@/components/ArticlesSection2026'
import { MobileMenu } from '@/components/MobileMenu'
import NewsletterSignup from '@/components/NewsletterSignup'

export const revalidate = 0

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    limit: 20,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  let featuredArticles = await payload.find({
    collection: 'articles',
    where: { featured: { equals: true } },
    limit: 3,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  // Fallback: if no featured articles, use the 3 latest articles
  if (featuredArticles.docs.length === 0) {
    featuredArticles = {
      ...featuredArticles,
      docs: articles.docs.slice(0, 3),
    }
  }

  const trendingArticles = await payload.find({
    collection: 'articles',
    where: { clickCount: { greater_than: 0 } },
    limit: 5,
    sort: '-clickCount',
    overrideAccess: true,
  })

  const subscriberCount = await payload.count({
    collection: 'subscribers',
    where: { status: { equals: 'active' } },
    overrideAccess: true,
  })

  const featuredIds = new Set(featuredArticles.docs.map((a: any) => a.id))
  const articleList = (articles.docs as any[]).filter((a) => !featuredIds.has(a.id))

  const categoryColors: Record<string, string> = {
    reglering: 'from-red-500 to-orange-500',
    utrustning: 'from-blue-500 to-cyan-500',
    utbildning: 'from-green-500 to-emerald-500',
    nyheter: 'from-purple-500 to-pink-500',
    marknad: 'from-yellow-500 to-amber-500',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <img src="/logo.png" alt="Rotorbladet" className="h-7 w-7 object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                Rotorbladet
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-black text-red-500 bg-red-50 rounded uppercase tracking-widest border border-red-200">
                Beta
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <div className="hidden lg:flex items-center gap-0.5 mr-3 border-r border-slate-100 pr-3">
                {[
                  ['nyheter', 'Nyheter'],
                  ['utrustning', 'Utrustning'],
                  ['reglering', 'Reglering'],
                  ['utbildning', 'Utbildning'],
                  ['marknad', 'Marknad'],
                ].map(([slug, label]) => (
                  <Link
                    key={slug}
                    href={`/kategori/${slug}`}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <Link
                href="/verktyg"
                className="hidden sm:inline-flex px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Verktyg
              </Link>
              <Link
                href="/admin"
                className="hidden sm:inline-flex px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/prenumerera"
                className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold rounded-full transition-colors"
              >
                ✉ Prenumerera
              </Link>
              <MobileMenu />
            </nav>
          </div>
        </div>
      </header>

      {/* Articles section */}
      <ArticlesSection
        initialArticles={articleList}
        totalArticles={articles.totalDocs}
        featuredArticles={featuredArticles.docs as any[]}
        trendingArticles={trendingArticles.docs as any[]}
        categoryColors={categoryColors}
        subscriberCount={subscriberCount.totalDocs}
      />

      {/* Footer - compact */}
      <footer className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-white font-black text-sm">Rotorbladet</span>
              <span className="text-slate-600 text-xs">Sveriges drönarnyheter</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link href="/" className="hover:text-white transition-colors">
                Startsida
              </Link>
              <Link href="/prenumerera" className="hover:text-white transition-colors">
                Prenumerera
              </Link>
              <Link href="/verktyg" className="hover:text-white transition-colors">
                Verktyg
              </Link>
              <a
                href="/api/rss"
                className="hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z" />
                </svg>
                RSS
              </a>
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
            </div>
            <span className="text-slate-600 text-xs">
              © {new Date().getFullYear()} Rotorbladet.se
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
