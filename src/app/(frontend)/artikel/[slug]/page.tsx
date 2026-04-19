import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const baseUrl = 'https://rotorbladet.se'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })

  if (articles.docs.length === 0) return {}

  const article = articles.docs[0] as any
  const url = `${baseUrl}/artikel/${slug}`

  return {
    title: article.title,
    description: article.summary || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.summary || undefined,
      publishedTime: article.publishedAt,
      section: article.category,
      tags: Array.isArray(article.tags) ? article.tags : undefined,
      images: article.cover_url
        ? [{ url: article.cover_url, width: 1200, height: 630, alt: article.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || undefined,
      images: article.cover_url ? [article.cover_url] : undefined,
    },
  }
}

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

  const article = articles.docs[0] as any
  let sourceHost: string | null = null
  if (article.source) {
    sourceHost = article.source
  } else if (article.original_url) {
    try {
      sourceHost = new URL(article.original_url).hostname.replace(/^www\./, '')
    } catch {
      sourceHost = null
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url: `${baseUrl}/artikel/${article.slug}`,
    image: article.cover_url ? [article.cover_url] : undefined,
    articleSection: article.category,
    keywords: Array.isArray(article.tags) ? article.tags.join(', ') : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Rotorbladet',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/artikel/${article.slug}`,
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Rotorbladet" className="h-7 w-7 object-contain" />
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
              Rotorbladet
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            ← Alla nyheter
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <article>
          {/* Category + date */}
          <div className="flex items-center gap-3 mb-6">
            {article.category && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 uppercase tracking-wider">
                {article.category}
              </span>
            )}
            {article.publishedAt && (
              <time className="text-sm text-slate-500">
                {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>

          {/* Cover image */}
          {article.cover_url && (
            <div className="rounded-2xl overflow-hidden mb-8 bg-slate-100">
              <img
                src={article.cover_url}
                alt={article.title}
                className="w-full h-auto max-h-[480px] object-cover"
              />
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <div className="bg-slate-50 border-l-4 border-purple-500 rounded-r-xl p-6 mb-8">
              <p className="text-lg text-slate-700 leading-relaxed">{article.summary}</p>
            </div>
          )}

          {/* Read original CTA */}
          {article.original_url && (
            <a
              href={article.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl transition-all group mb-8 shadow-lg shadow-purple-500/20"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-purple-200 mb-1">
                  Läs originalkällan
                </div>
                <div className="font-bold text-lg">{sourceHost || 'Öppna artikel'}</div>
              </div>
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
              {article.tags.map((tag: any, i: number) => (
                <span
                  key={i}
                  className="text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors"
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
