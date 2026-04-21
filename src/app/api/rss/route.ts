import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const articles = await payload.find({
      collection: 'articles',
      limit: 50,
      sort: '-publishedAt',
      overrideAccess: true,
    })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rotorbladet.se'
    const siteName = 'Rotorbladet'
    const siteDescription = 'Sveriges ledande nyhetssajt för drönarbranschen'

    const rssItems = articles.docs
      .map((article: any) => {
        if (!article.original_url) return null

        const pubDate = article.publishedAt
          ? new Date(article.publishedAt).toUTCString()
          : new Date().toUTCString()

        const url = escapeXml(article.original_url)

        return `
      <item>
        <title>${escapeXml(article.title)}</title>
        <description><![CDATA[${article.summary || ''}]]></description>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${pubDate}</pubDate>
        ${article.category ? `<category>${escapeXml(article.category)}</category>` : ''}
        ${article.cover_url ? `<enclosure url="${escapeXml(article.cover_url)}" type="image/jpeg" />` : ''}
      </item>`
      })
      .filter(Boolean)
      .join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <description>${siteDescription}</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    <language>sv-se</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 })
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
