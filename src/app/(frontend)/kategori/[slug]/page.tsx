import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'

const categoryLabels: Record<string, string> = {
  reglering: 'Reglering',
  utrustning: 'Utrustning',
  utbildning: 'Utbildning',
  nyheter: 'Nyheter',
  marknad: 'Marknad',
}

const categoryColors: Record<string, string> = {
  reglering: 'from-orange-500 to-red-500',
  utrustning: 'from-cyan-500 to-blue-500',
  utbildning: 'from-emerald-500 to-green-500',
  nyheter: 'from-purple-500 to-pink-500',
  marknad: 'from-amber-500 to-yellow-500',
}

const categoryDescriptions: Record<string, string> = {
  reglering: 'Senaste nytt om lagar, regler och politiska beslut som påverkar drönarindustrin.',
  utrustning: 'Tester, recensioner och nyheter om drönarutrustning och tillbehör.',
  utbildning: 'Kurser, certifieringar och utbildningsmaterial för drönarpiloter.',
  nyheter: 'Senaste nyheterna från drönarvärlden.',
  marknad: 'Företagsnyheter, uppköp och marknadsanalys.',
}

export async function generateStaticParams() {
  return [
    { slug: 'reglering' },
    { slug: 'utrustning' },
    { slug: 'utbildning' },
    { slug: 'nyheter' },
    { slug: 'marknad' },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<import('next').Metadata> {
  const { slug } = await params
  const category = categoryLabels[slug] || slug
  const description = categoryDescriptions[slug] || `Artiklar om ${category} på Rotorbladet.`
  const url = `https://rotorbladet.se/kategori/${slug}`

  return {
    title: category,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${category} | Rotorbladet`,
      description,
      siteName: 'Rotorbladet',
    },
    twitter: {
      card: 'summary',
      title: `${category} | Rotorbladet`,
      description,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categoryLabels[slug]

  if (!category) {
    notFound()
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: {
      category: { equals: slug },
    },
    sort: '-publishedAt',
    limit: 50,
  })

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
                {[
                  { slug: 'nyheter', label: 'Nyheter', color: 'purple' },
                  { slug: 'utrustning', label: 'Utrustning', color: 'cyan' },
                  { slug: 'reglering', label: 'Reglering', color: 'orange' },
                  { slug: 'utbildning', label: 'Utbildning', color: 'emerald' },
                  { slug: 'marknad', label: 'Marknad', color: 'amber' },
                ].map((cat) => {
                  const isActive = slug === cat.slug
                  const activeClasses: Record<string, string> = {
                    purple: 'text-purple-700 bg-purple-100',
                    cyan: 'text-cyan-700 bg-cyan-100',
                    orange: 'text-orange-700 bg-orange-100',
                    emerald: 'text-emerald-700 bg-emerald-100',
                    amber: 'text-amber-700 bg-amber-100',
                  }
                  const hoverClasses: Record<string, string> = {
                    purple: 'text-slate-600 hover:text-purple-600 hover:bg-purple-50',
                    cyan: 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-50',
                    orange: 'text-slate-600 hover:text-orange-600 hover:bg-orange-50',
                    emerald: 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50',
                    amber: 'text-slate-600 hover:text-amber-600 hover:bg-amber-50',
                  }
                  return (
                    <Link
                      key={cat.slug}
                      href={`/kategori/${cat.slug}`}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                        isActive ? activeClasses[cat.color] : hoverClasses[cat.color]
                      }`}
                    >
                      {cat.label}
                    </Link>
                  )
                })}
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

      <main>
        {/* Category Header */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Hem
              </Link>
              <span>/</span>
              <span className="text-white">{category}</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r ${
                  categoryColors[slug] || 'from-slate-500 to-slate-600'
                }`}
              >
                {category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              {category}
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl">{categoryDescriptions[slug]}</p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {articles.length > 0 ? (
            <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6">
              {articles.map((article: any) => (
                <a
                  key={article.id}
                  href={article.original_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="masonry-item group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 break-inside-avoid mb-6"
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
                      <span
                        data-category={article.category}
                        className={`category-badge px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r ${
                          categoryColors[article.category] || 'from-slate-500 to-slate-600'
                        }`}
                      >
                        {article.category}
                      </span>
                      {article.publishedAt && (
                        <time className="text-xs text-slate-500 font-medium">
                          {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </time>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        Källa:{' '}
                        {article.source ||
                          (() => {
                            try {
                              return article.original_url
                                ? new URL(article.original_url).hostname.replace(/^www\./, '')
                                : ''
                            } catch {
                              return ''
                            }
                          })()}
                      </span>
                      <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        Läs mer
                        <svg
                          className="w-4 h-4"
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
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                Inga artiklar hittades i kategorin {category}.
              </p>
              <Link
                href="/"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Tillbaka till startsidan
              </Link>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Få fler artiklar om {category.toLowerCase()}
              </h2>
              <p className="text-slate-600 mb-6">
                Prenumerera på vårt nyhetsbrev och få de senaste uppdateringarna direkt till din
                inkorg.
              </p>
              <NewsletterSignup source={`category-${slug}`} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-lg font-bold text-white mb-2">Rotorbladet</p>
              <p className="text-sm">Sveriges drönarhäftigaste nyhetsbrev</p>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/prenumerera" className="text-sm hover:text-white transition-colors">
                Prenumerera
              </Link>
              <a
                href="mailto:gustav@copture.com"
                className="text-sm hover:text-white transition-colors"
              >
                Kontakt
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs">
            <p>© 2024 Rotorbladet. Alla rättigheter reserverade.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
