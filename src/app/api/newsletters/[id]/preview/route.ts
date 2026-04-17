import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest } from 'next/server'
import {
  getSiteUrl,
  mapArticleForEmail,
  renderNewsletterHtml,
} from '@/lib/newsletter'
import { headers } from 'next/headers'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    // Auth check
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return new Response('Ej behörig', { status: 401 })
    }

    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 2,
    })

    if (!newsletter) {
      return new Response('Nyhetsbrev hittades inte', { status: 404 })
    }

    const articles = (newsletter.articles || []).map((a: any) => mapArticleForEmail(a))
    const siteUrl = getSiteUrl()

    const html = await renderNewsletterHtml({
      subject: newsletter.subject,
      preheader: newsletter.preheader || undefined,
      introText: newsletter.introText || undefined,
      outroText: newsletter.outroText || undefined,
      articles,
      unsubscribeUrl: `${siteUrl}/api/unsubscribe/preview-token`,
      webVersionUrl: `${siteUrl}/newsletter/${newsletter.id}`,
      siteUrl,
    })

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error: any) {
    console.error('Preview error:', error)
    return new Response(error?.message || 'Fel', { status: 500 })
  }
}
