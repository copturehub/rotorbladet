import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (articles.docs.length === 0) {
    notFound()
  }

  const article = articles.docs[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Tillbaka till startsidan
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {article.category}
            </span>
            {article.publishedAt && (
              <time className="text-sm text-gray-500">
                {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

          {article.summary && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{article.summary}</p>
          )}

          {article.content && (
            <div className="prose prose-lg max-w-none">
              {/* Rich text content will be rendered here */}
              <div dangerouslySetInnerHTML={{ __html: JSON.stringify(article.content) }} />
            </div>
          )}

          {article.original_url && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Källa:{' '}
                <a
                  href={article.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {article.source || article.original_url}
                </a>
              </p>
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  #{typeof tag === 'object' ? tag.name : tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
