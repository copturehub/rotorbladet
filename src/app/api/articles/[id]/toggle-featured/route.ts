import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { id } = await params

    // Check if user is authenticated via Payload admin
    const user = await payload.auth({
      headers: req.headers,
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current article
    const article = await payload.findByID({
      collection: 'articles',
      id,
      depth: 0,
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Toggle featured status
    const updated = await payload.update({
      collection: 'articles',
      id,
      data: {
        featured: !(article as any).featured,
      } as any,
      req: req as any,
    })

    return NextResponse.json({
      success: true,
      featured: (updated as any).featured,
    })
  } catch (error) {
    console.error('Error toggling featured:', error)
    return NextResponse.json({ error: 'Failed to toggle featured status' }, { status: 500 })
  }
}
