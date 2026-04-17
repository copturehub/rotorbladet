import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  getSiteUrl,
  mapArticleForEmail,
  renderNewsletterHtml,
  renderNewsletterText,
} from '@/lib/newsletter'
import { headers } from 'next/headers'

const FROM_EMAIL = 'Rotorbladet <nyhetsbrev@rotorbladet.se>'
const REPLY_TO = 'gustav@copture.com'
const BATCH_SIZE = 100 // Resend's batch API limit

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })

    // Auth check
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return NextResponse.json({ error: 'Ej behörig' }, { status: 401 })
    }

    // Load newsletter
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 2,
    })

    if (!newsletter) {
      return NextResponse.json({ error: 'Nyhetsbrev hittades inte' }, { status: 404 })
    }

    if (newsletter.status === 'sent') {
      return NextResponse.json(
        { error: 'Nyhetsbrevet är redan skickat' },
        { status: 400 },
      )
    }

    const articles = (newsletter.articles || []).map((a: any) => mapArticleForEmail(a))

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'Nyhetsbrevet innehåller inga artiklar' },
        { status: 400 },
      )
    }

    // Fetch all active subscribers
    const subscribersResult = await payload.find({
      collection: 'subscribers',
      where: {
        status: { equals: 'active' },
      },
      limit: 10000,
      pagination: false,
    })

    const subscribers = subscribersResult.docs

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'Inga aktiva prenumeranter att skicka till' },
        { status: 400 },
      )
    }

    const siteUrl = getSiteUrl()
    const resend = new Resend(process.env.RESEND_API_KEY)

    let sentCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Send in batches
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE)

      const emails = await Promise.all(
        batch.map(async (sub: any) => {
          const emailProps = {
            subject: newsletter.subject,
            preheader: newsletter.preheader || undefined,
            introText: newsletter.introText || undefined,
            outroText: newsletter.outroText || undefined,
            articles,
            unsubscribeUrl: `${siteUrl}/api/unsubscribe/${sub.unsubscribeToken}`,
            webVersionUrl: `${siteUrl}/newsletter/${newsletter.id}`,
            siteUrl,
          }

          const html = await renderNewsletterHtml(emailProps)
          const text = await renderNewsletterText(emailProps)

          return {
            from: FROM_EMAIL,
            to: [sub.email],
            replyTo: REPLY_TO,
            subject: newsletter.subject,
            html,
            text,
            headers: {
              'List-Unsubscribe': `<${siteUrl}/api/unsubscribe/${sub.unsubscribeToken}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }
        }),
      )

      const { data, error } = await resend.batch.send(emails)

      if (error) {
        console.error('Resend batch error:', error)
        errors.push(error.message)
        errorCount += batch.length
      } else {
        sentCount += batch.length
      }

      // Small delay to avoid rate limits
      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    // Update newsletter status
    await payload.update({
      collection: 'newsletters',
      id,
      data: {
        status: 'sent',
        sentAt: new Date().toISOString(),
        recipientCount: sentCount,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Skickat till ${sentCount} prenumeranter${errorCount > 0 ? ` (${errorCount} fel)` : ''}`,
      sentCount,
      errorCount,
      errors,
    })
  } catch (error: any) {
    console.error('Send newsletter error:', error)
    return NextResponse.json(
      { error: error?.message || 'Något gick fel' },
      { status: 500 },
    )
  }
}
