import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { id } = await params

    // Get current article
    const article = await payload.findByID({
      collection: 'articles',
      id,
      depth: 0,
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Increment click count
    const currentCount = (article as any).clickCount || 0
    const updated = await payload.update({
      collection: 'articles',
      id,
      data: {
        clickCount: currentCount + 1,
      } as any,
      req: req as any,
    })

    return NextResponse.json({
      success: true,
      clickCount: (updated as any).clickCount,
    })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
