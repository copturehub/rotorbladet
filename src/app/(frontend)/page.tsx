import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'
import { CategoryBadge } from '@/components/CategoryBadge'

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

  const subscriberCount = await payload.count({
    collection: 'subscribers',
    where: { status: { equals: 'active' } },
    overrideAccess: true,
  })

  const articleList = articles.docs as any[]

  const categoryColors: Record<string, string> = {
    reglering: 'from-red-500 to-orange-500',
    utrustning: 'from-blue-500 to-cyan-500',
    utbildning: 'from-green-500 to-emerald-500',
    nyheter: 'from-purple-500 to-pink-500',
    affarer: 'from-yellow-500 to-amber-500',
    affärer: 'from-yellow-500 to-amber-500',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900">Rotorbladet</span>
              <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full uppercase tracking-wider">
                Beta
              </span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              {/* Categories - visible on larger screens */}
              <div className="hidden lg:flex items-center gap-1 mr-2">
                <Link
                  href="/kategori/reglering"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                >
                  Reglering
                </Link>
                <Link
                  href="/kategori/nyheter"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                >
                  Nyheter
                </Link>
                <Link
                  href="/kategori/affarer"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                >
                  Affärer
                </Link>
              </div>

              <Link
                href="/prenumerera"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Prenumerera
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero - Newsletter First */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative gradient blobs - optimized for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-2xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/15 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-white/10 border border-white/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">
                Veckans drönarnyheter direkt i inkorgen
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
              Allt viktigt som händer i <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                drönarbranschen
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Regleringar, nya drönare, affärer och utbildning. Vi bevakar branschen så du slipper.
              Få veckans viktigaste nyheter sammanfattat på svenska.
            </p>

            <NewsletterSignup source="homepage-hero" variant="hero" />

            {subscriberCount.totalDocs > 0 && (
              <p className="mt-8 text-sm text-white/60">
                Gå med {subscriberCount.totalDocs.toLocaleString('sv-SE')}+ andra som redan
                prenumererar
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Articles section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Senaste nyheterna
            </h2>
            <p className="text-slate-600 mt-2">Handplockade artiklar från hela drönarbranschen</p>
          </div>
        </div>

        {articleList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articleList.map((article: any) => (
              <a
                key={article.id}
                href={article.original_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                {article.cover_url && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={article.cover_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  {article.source && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 mt-auto border-t border-slate-100">
                      <span>Källa:</span>
                      <span className="font-semibold text-slate-700">{article.source}</span>
                      <span className="ml-auto text-slate-400 group-hover:text-slate-900 transition-colors">
                        Läs mer →
                      </span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-600 text-lg">Inga artiklar publicerade än.</p>
            </div>
          </div>
        )}
      </main>

      {/* Secondary newsletter CTA */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Få veckans drönarnyheter i inkorgen
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Ett mail i veckan. Noga utvalda artiklar. Ingen spam. Avregistrera när du vill.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterSignup source="homepage-secondary" variant="inline" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-black mb-2">Rotorbladet</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sveriges ledande nyhetssajt för drönarbranschen. Aggregerade nyheter från hela
                världen.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-slate-300">
                Länkar
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                    Startsida
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prenumerera"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Prenumerera
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-slate-300">
                Nyhetsbrev
              </h4>
              <p className="text-slate-400 text-sm mb-4">Prenumerera på veckobrevet</p>
              <NewsletterSignup source="footer" variant="footer" />
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Rotorbladet.se · Alla rättigheter reserverade
          </div>
        </div>
      </footer>
    </div>
  )
}
