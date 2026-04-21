import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const limit = Math.min(Number(searchParams.get('limit') || 20), 50)
  const page = Math.max(Number(searchParams.get('page') || 1), 1)

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const articles = await payload.find({
    collection: 'articles',
    limit,
    page,
    sort: '-publishedAt',
    overrideAccess: true,
  })

  return NextResponse.json(articles)
}
