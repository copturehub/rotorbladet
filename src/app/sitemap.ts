import { getPayload } from 'payload'
import config from '@/payload.config'
import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rotorbladet.se'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    limit: 1000,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  const articleUrls: MetadataRoute.Sitemap = articles.docs
    .filter((a: any) => a.slug && a.publishedAt)
    .map((article: any) => ({
      url: `${baseUrl}/artikel/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: article.featured ? 0.9 : 0.6,
    }))

  const categoryUrls: MetadataRoute.Sitemap = [
    'nyheter',
    'utrustning',
    'reglering',
    'utbildning',
    'marknad',
  ].map((slug) => ({
    url: `${baseUrl}/kategori/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    {
      url: `${baseUrl}/prenumerera`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/verktyg`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...categoryUrls, ...articleUrls]
}
