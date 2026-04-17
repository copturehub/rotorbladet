import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getSiteUrl,
  mapArticleForEmail,
  renderNewsletterHtml,
} from '@/lib/newsletter'

export const revalidate = 0

export default async function NewsletterWebVersion({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let newsletter
  try {
    newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 2,
      overrideAccess: true,
    })
  } catch {
    notFound()
  }

  if (!newsletter || newsletter.status !== 'sent') {
    notFound()
  }

  const articles = (newsletter.articles || []).map((a: any) => mapArticleForEmail(a))
  const siteUrl = getSiteUrl()

  const html = await renderNewsletterHtml({
    subject: newsletter.subject,
    preheader: newsletter.preheader || undefined,
    introText: newsletter.introText || undefined,
    outroText: newsletter.outroText || undefined,
    articles,
    unsubscribeUrl: `${siteUrl}/prenumerera`,
    webVersionUrl: `${siteUrl}/newsletter/${newsletter.id}`,
    siteUrl,
  })

  return (
    <div>
      <div className="bg-slate-900 text-white text-center py-3 px-4 text-sm">
        Du läser webbversionen av vårt nyhetsbrev ·{' '}
        <Link href="/prenumerera" className="underline font-semibold hover:text-slate-200">
          Prenumerera här
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
