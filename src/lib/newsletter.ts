import { render } from '@react-email/render'
import NewsletterEmail, {
  NewsletterArticle,
  NewsletterEmailProps,
} from '@/emails/NewsletterEmail'
import React from 'react'

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://rotorbladet.se'
  )
}

export function mapArticleForEmail(article: any): NewsletterArticle {
  return {
    id: String(article.id),
    title: article.title,
    summary: article.summary,
    cover_url: article.cover_url,
    source: article.source,
    category: article.category,
    slug: article.slug,
  }
}

export async function renderNewsletterHtml(
  props: NewsletterEmailProps,
): Promise<string> {
  return render(React.createElement(NewsletterEmail, props))
}

export async function renderNewsletterText(
  props: NewsletterEmailProps,
): Promise<string> {
  return render(React.createElement(NewsletterEmail, props), { plainText: true })
}
