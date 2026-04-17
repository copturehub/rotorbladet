import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

export interface NewsletterArticle {
  id: string
  title: string
  summary?: string
  cover_url?: string
  source?: string
  category?: string
  slug?: string
}

export interface NewsletterEmailProps {
  subject: string
  preheader?: string
  introText?: string
  outroText?: string
  articles: NewsletterArticle[]
  unsubscribeUrl: string
  webVersionUrl: string
  siteUrl: string
}

const main = {
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  width: '100%',
}

const header = {
  backgroundColor: '#0f172a',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 900,
  letterSpacing: '-0.5px',
  margin: 0,
}

const tagline = {
  color: '#cbd5e1',
  fontSize: '14px',
  margin: '4px 0 0',
}

const content = {
  padding: '32px 24px',
}

const introStyle = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
}

const articleCard = {
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '24px',
  border: '1px solid #e2e8f0',
}

const articleImage = {
  width: '100%',
  height: 'auto',
  display: 'block',
}

const articleBody = {
  padding: '20px',
}

const categoryBadge = {
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: '999px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  display: 'inline-block',
  margin: '0 0 12px',
}

const articleTitle = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: '26px',
  margin: '0 0 12px',
}

const articleSummary = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 16px',
}

const articleLink = {
  color: '#0f172a',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
}

const source = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0 0 8px',
}

const outroStyle = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
}

const footer = {
  backgroundColor: '#f1f5f9',
  padding: '24px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '4px 0',
}

const footerLink = {
  color: '#475569',
  textDecoration: 'underline',
}

export function NewsletterEmail({
  subject,
  preheader,
  introText,
  outroText,
  articles,
  unsubscribeUrl,
  webVersionUrl,
  siteUrl,
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      {preheader && <Preview>{preheader}</Preview>}
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Link href={siteUrl} style={{ textDecoration: 'none' }}>
              <Heading as="h1" style={logo}>
                Rotorbladet
              </Heading>
            </Link>
            <Text style={tagline}>Sveriges ledande nyhetssajt för drönarbranschen</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {introText && <Text style={introStyle}>{introText}</Text>}

            {articles.map((article) => {
              const articleUrl = article.slug
                ? `${siteUrl}/artikel/${article.slug}`
                : siteUrl
              return (
                <Section key={article.id} style={articleCard}>
                  {article.cover_url && (
                    <Link href={articleUrl}>
                      <Img
                        src={article.cover_url}
                        alt={article.title}
                        style={articleImage}
                      />
                    </Link>
                  )}
                  <Section style={articleBody}>
                    {article.category && (
                      <Text style={categoryBadge}>{article.category}</Text>
                    )}
                    <Heading as="h2" style={articleTitle}>
                      <Link href={articleUrl} style={{ color: '#0f172a', textDecoration: 'none' }}>
                        {article.title}
                      </Link>
                    </Heading>
                    {article.summary && <Text style={articleSummary}>{article.summary}</Text>}
                    {article.source && <Text style={source}>Källa: {article.source}</Text>}
                    <Link href={articleUrl} style={articleLink}>
                      Läs mer →
                    </Link>
                  </Section>
                </Section>
              )
            })}

            {outroText && <Text style={outroStyle}>{outroText}</Text>}
          </Section>

          <Hr style={{ margin: 0, borderColor: '#e2e8f0' }} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Du får detta mail eftersom du prenumererar på Rotorbladet.
            </Text>
            <Text style={footerText}>
              <Link href={webVersionUrl} style={footerLink}>
                Visa i webbläsare
              </Link>
              {' · '}
              <Link href={unsubscribeUrl} style={footerLink}>
                Avprenumerera
              </Link>
            </Text>
            <Text style={{ ...footerText, marginTop: '12px' }}>
              © {new Date().getFullYear()} Rotorbladet.se
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterEmail
