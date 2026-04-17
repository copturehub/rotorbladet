import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'subscribers',
      where: {
        unsubscribeToken: { equals: token },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.redirect(
        new URL('/unsubscribe-error', _request.url),
      )
    }

    const subscriber = result.docs[0]

    if (subscriber.status === 'active') {
      await payload.update({
        collection: 'subscribers',
        id: subscriber.id,
        data: {
          status: 'unsubscribed',
          unsubscribedAt: new Date().toISOString(),
        },
      })
    }

    return NextResponse.redirect(new URL('/unsubscribed', _request.url))
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.redirect(new URL('/unsubscribe-error', _request.url))
  }
}
