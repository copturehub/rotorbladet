import { getPayload } from 'payload'
import config from '@/payload.config'
import type { MetadataRoute } from 'next'

const baseUrl = 'https://rotorbladet.se'

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
    .filter((a: any) => a.slug)
    .map((article: any) => ({
      url: `${baseUrl}/artikel/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: article.featured ? 0.9 : 0.7,
    }))

  const categoryUrls: MetadataRoute.Sitemap = [
    'nyheter',
    'utrustning',
    'reglering',
    'utbildning',
    'affarer',
  ].map((slug) => ({
    url: `${baseUrl}/kategori/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ]
}
