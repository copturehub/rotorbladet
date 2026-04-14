import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'

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

  const [heroArticle, ...restArticles] = articles.docs as any[]

  const categoryColors: Record<string, string> = {
    reglering: 'from-red-500 to-orange-500',
    utrustning: 'from-blue-500 to-cyan-500',
    utbildning: 'from-green-500 to-emerald-500',
    nyheter: 'from-purple-500 to-pink-500',
    affarer: 'from-yellow-500 to-amber-500',
    affärer: 'from-yellow-500 to-amber-500',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Rotorbladet
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-medium">
                Sveriges ledande nyhetssajt för drönarbranschen
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Article */}
        {heroArticle && (
          <a
            href={heroArticle.original_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-12 group"
          >
            <article className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="grid md:grid-cols-2 gap-0">
                {heroArticle.cover_url && (
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <img
                      src={heroArticle.cover_url}
                      alt={heroArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryColors[heroArticle.category] || 'from-gray-500 to-gray-600'}`}
                    >
                      {heroArticle.category}
                    </span>
                    {heroArticle.publishedAt && (
                      <time className="text-sm text-slate-500 font-medium">
                        {new Date(heroArticle.publishedAt).toLocaleDateString('sv-SE', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </time>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight group-hover:text-slate-700 transition-colors">
                    {heroArticle.title}
                  </h2>
                  {heroArticle.summary && (
                    <p className="text-slate-600 text-lg leading-relaxed mb-6 line-clamp-3">
                      {heroArticle.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Källa:</span>
                    <span className="font-semibold text-slate-700">{heroArticle.source}</span>
                  </div>
                </div>
              </div>
            </article>
          </a>
        )}

        {/* Masonry Grid */}
        {restArticles.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {restArticles.map((article: any) => (
              <a
                key={article.id}
                href={article.original_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-inside-avoid group"
              >
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {article.cover_url && (
                    <div className="relative overflow-hidden">
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryColors[article.category] || 'from-gray-500 to-gray-600'}`}
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-slate-700 transition-colors">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {article.summary}
                      </p>
                    )}
                    {article.source && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Källa:</span>
                        <span className="font-semibold">{article.source}</span>
                      </div>
                    )}
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}

        {articles.docs.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
              <p className="text-slate-600 text-lg mb-4">Inga artiklar publicerade än.</p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg hover:from-slate-800 hover:to-slate-600 transition-all font-medium"
              >
                Gå till admin-panelen
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Rotorbladet.se</h2>
          <p className="text-slate-400">Sveriges ledande nyhetssajt för drönarbranschen</p>
        </div>
      </footer>
    </div>
  )
}
