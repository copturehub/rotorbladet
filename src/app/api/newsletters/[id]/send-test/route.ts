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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'E-postadress krävs' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Auth check: must be logged in as payload user
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return NextResponse.json({ error: 'Ej behörig' }, { status: 401 })
    }

    // Load newsletter with populated articles
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 2,
    })

    if (!newsletter) {
      return NextResponse.json({ error: 'Nyhetsbrev hittades inte' }, { status: 404 })
    }

    const articles = (newsletter.articles || []).map((a: any) => mapArticleForEmail(a))

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'Nyhetsbrevet innehåller inga artiklar' },
        { status: 400 },
      )
    }

    const siteUrl = getSiteUrl()
    const emailProps = {
      subject: newsletter.subject,
      preheader: newsletter.preheader || undefined,
      introText: newsletter.introText || undefined,
      outroText: newsletter.outroText || undefined,
      articles,
      unsubscribeUrl: `${siteUrl}/api/unsubscribe/test-token`,
      webVersionUrl: `${siteUrl}/newsletter/${newsletter.id}`,
      siteUrl,
    }

    const html = await renderNewsletterHtml(emailProps)
    const text = await renderNewsletterText(emailProps)

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `[TEST] ${newsletter.subject}`,
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Testmail skickat till ${email}`,
      id: data?.id,
    })
  } catch (error: any) {
    console.error('Send test error:', error)
    return NextResponse.json(
      { error: error?.message || 'Något gick fel' },
      { status: 500 },
    )
  }
}
