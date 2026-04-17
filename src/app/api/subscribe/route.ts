import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-postadress krävs' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Ogiltig e-postadress' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'subscribers',
      where: {
        email: { equals: email.toLowerCase() },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0]
      if (subscriber.status === 'unsubscribed') {
        // Reactivate subscription
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            status: 'active',
            subscribedAt: new Date().toISOString(),
            unsubscribedAt: null,
          },
        })
        return NextResponse.json({
          success: true,
          message: 'Välkommen tillbaka! Din prenumeration är återaktiverad.',
        })
      }
      return NextResponse.json({
        success: true,
        message: 'Du prenumererar redan på Rotorbladet.',
      })
    }

    // Create new subscriber
    await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase(),
        status: 'active',
        source: source || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Tack! Du prenumererar nu på Rotorbladet.',
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Något gick fel. Försök igen senare.' },
      { status: 500 },
    )
  }
}
