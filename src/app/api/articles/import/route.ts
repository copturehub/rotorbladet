import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('api_key')
  if (apiKey !== process.env.ARTICLES_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, summary, category, tags, original_url, source, cover_url } = body

  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Duplicate check on original_url
  if (original_url) {
    const existing = await payload.find({
      collection: 'articles',
      where: { original_url: { equals: original_url } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json(
        {
          error: 'duplicate',
          message: 'Article with this URL already exists',
          id: existing.docs[0].id,
        },
        { status: 409 },
      )
    }
  }

  const article = await payload.create({
    collection: 'articles',
    draft: false,
    data: {
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      summary: summary || undefined,
      category: category || 'nyheter',
      tags: tags || [],
      original_url: original_url || undefined,
      source: source || undefined,
      cover_url: cover_url || undefined,
      publishedAt: new Date().toISOString(),
    } as any,
    overrideAccess: true,
  })

  return NextResponse.json(article, { status: 201 })
}
