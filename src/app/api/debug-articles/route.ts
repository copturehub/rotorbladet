import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Temporary debug endpoint - shows recent articles with all fields
export async function GET() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'articles',
    limit: 5,
    sort: '-createdAt',
    depth: 0,
    overrideAccess: true,
  })
  return NextResponse.json({
    total: res.totalDocs,
    articles: res.docs.map((a) => ({
      id: a.id,
      title: a.title,
      original_url: a.original_url || null,
      source: a.source || null,
      cover_url: a.cover_url ? 'SET' : null,
      category: a.category,
      publishedAt: a.publishedAt,
    })),
  })
}
