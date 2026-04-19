import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ReadingProgress } from '@/components/ReadingProgress'

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

  const related = await payload.find({
    collection: 'articles',
    where: { and: [{ category: { equals: article.category } }, { slug: { not_equals: slug } }] },
    limit: 4,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header - matching homepage */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="Rotorbladet" className="h-6 w-6 object-contain" />
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                Rotorbladet
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Alla nyheter
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <article>
          {/* Category + date */}
          <div className="flex items-center gap-3 mb-5">
            {article.category && (
              <Link
                href={`/kategori/${article.category}`}
                className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                {article.category}
              </Link>
            )}
            {article.publishedAt && (
              <time className="text-sm text-slate-400">
                {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {sourceHost && <span className="ml-auto text-xs text-slate-400">{sourceHost}</span>}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>

          {/* Cover image */}
          {article.cover_url && (
            <div className="relative rounded-2xl overflow-hidden mb-8 bg-slate-100 aspect-video">
              <Image
                src={article.cover_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 672px) 100vw, 672px"
              />
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-slate-200 pl-5">
              {article.summary}
            </p>
          )}

          {/* Read original CTA */}
          {article.original_url && (
            <a
              href={article.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all group mb-8"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Läs originalkällan
                </div>
                <div className="font-bold text-lg">{sourceHost || 'Öppna artikel'}</div>
              </div>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0"
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
                  className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full"
                >
                  #{typeof tag === 'object' ? tag.name : tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related articles */}
        {related.docs.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-5">
              Fler nyheter inom {article.category}
            </h2>
            <div className="flex flex-col gap-3">
              {(related.docs as any[]).map((rel) => {
                let relSource = rel.source
                if (!relSource && rel.original_url) {
                  try {
                    relSource = new URL(rel.original_url).hostname.replace(/^www\./, '')
                  } catch {
                    relSource = null
                  }
                }
                return (
                  <a
                    key={rel.id}
                    href={rel.original_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white"
                  >
                    {rel.cover_url && (
                      <div className="relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <Image
                          src={rel.cover_url}
                          alt={rel.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-slate-600 line-clamp-2 leading-snug">
                        {rel.title}
                      </p>
                      {relSource && <p className="text-xs text-slate-400 mt-1">{relSource}</p>}
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
