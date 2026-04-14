import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    limit: 20,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Rotorbladet.se</h1>
          <p className="text-gray-600 mt-1">Sveriges ledande nyhetssajt för drönarbranschen</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.docs.map((article: any) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {article.cover_url && (
                <img
                  src={article.cover_url}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  {article.publishedAt && (
                    <time className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString('sv-SE')}
                    </time>
                  )}
                </div>

                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  <Link href={`/artikel/${article.slug}`} className="hover:text-blue-600">
                    {article.title}
                  </Link>
                </h2>

                {article.summary && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.summary}</p>
                )}

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: any) => (
                      <span key={tag.id} className="text-xs text-gray-500">
                        #{typeof tag === 'object' ? tag.name : tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {articles.docs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Inga artiklar publicerade än.</p>
            <Link href="/admin" className="text-blue-600 hover:underline mt-2 inline-block">
              Gå till admin-panelen för att skapa din första artikel
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
