import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Dispatcher endpoint that routes incoming content to the right collection
 * based on `type` field from AI classification.
 *
 * Auth: Requires Authorization header matching CONTENT_INGEST_TOKEN env var.
 */
export async function POST(req: NextRequest) {
  // Optional auth: if CONTENT_INGEST_TOKEN env var is set, require it
  const expectedToken = process.env.CONTENT_INGEST_TOKEN
  if (expectedToken) {
    const authHeader = req.headers.get('authorization') || ''
    const provided = authHeader.replace(/^Bearer\s+/i, '').trim()
    if (provided !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = String(body.type || 'artikel').toLowerCase()
  const payload = await getPayload({ config })

  try {
    if (type === 'verktyg' || type === 'tool' || type === 'tjanst' || type === 'tjänst') {
      const toolData = {
        name: String(body.title || body.name || 'Namnlös tjänst'),
        url: String(body.original_url || body.url || ''),
        description: body.summary ? String(body.summary) : undefined,
        tool_category: mapToolCategory(body.tool_category || body.category),
        source: body.source ? String(body.source) : undefined,
        tags: body.tags as string | string[] | undefined,
        cover_url: body.cover_url ? String(body.cover_url) : undefined,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = await payload.create({ collection: 'tools', data: toolData as any })
      return NextResponse.json({ success: true, type: 'verktyg', id: doc.id })
    }

    // Default: artikel
    const articleData = {
      title: String(body.title || ''),
      summary: body.summary ? String(body.summary) : undefined,
      category: mapArticleCategory(body.category),
      tags: body.tags as string | string[] | undefined,
      original_url: body.original_url ? String(body.original_url) : undefined,
      source: body.source ? String(body.source) : undefined,
      cover_url: body.cover_url ? String(body.cover_url) : undefined,
      _status: (body._status as 'draft' | 'published') || 'published',
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await payload.create({ collection: 'articles', data: articleData as any })
    return NextResponse.json({ success: true, type: 'artikel', id: doc.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

type ArticleCategory = 'reglering' | 'utrustning' | 'utbildning' | 'nyheter' | 'affarer' | 'affärer'

function mapArticleCategory(raw: unknown): ArticleCategory {
  const valid: ArticleCategory[] = [
    'reglering',
    'utrustning',
    'utbildning',
    'nyheter',
    'affarer',
    'affärer',
  ]
  const v = String(raw || 'nyheter')
    .toLowerCase()
    .trim()
  if ((valid as string[]).includes(v)) return v as ArticleCategory
  return 'nyheter'
}

type ToolCategory = 'kartor' | 'vader' | 'regler' | 'utbildning' | 'verktyg' | 'myndighet'

function mapToolCategory(raw: unknown): ToolCategory {
  const valid: ToolCategory[] = ['kartor', 'vader', 'regler', 'utbildning', 'verktyg', 'myndighet']
  const v = String(raw || 'verktyg')
    .toLowerCase()
    .trim()
  if ((valid as string[]).includes(v)) return v as ToolCategory
  // Map common synonyms
  if (v.includes('karta') || v.includes('luftrum') || v.includes('map')) return 'kartor'
  if (v.includes('väder') || v.includes('vader') || v.includes('weather')) return 'vader'
  if (v.includes('regel') || v.includes('tillstånd') || v.includes('lag')) return 'regler'
  if (v.includes('myndighet') || v.includes('organisation')) return 'myndighet'
  if (v.includes('utbildning') || v.includes('kurs') || v.includes('certifi')) return 'utbildning'
  return 'verktyg'
}
