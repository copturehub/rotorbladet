import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data?.title && (operation === 'create' || !data.slug)) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[åä]/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
        // Auto-set publishedAt on create if missing or invalid
        if (operation === 'create' && data) {
          if (!data.publishedAt || isNaN(new Date(data.publishedAt).getTime())) {
            data.publishedAt = new Date().toISOString()
          }
        }
        // Normalize tags: accept array, comma-separated string, or array of strings
        if (data?.tags) {
          if (typeof data.tags === 'string') {
            data.tags = data.tags
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          } else if (Array.isArray(data.tags)) {
            data.tags = data.tags
              .flatMap((t: unknown) =>
                typeof t === 'string' ? t.split(',').map((s) => s.trim()) : [],
              )
              .filter(Boolean)
          }
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-scrape og:image from original_url if cover_url missing
        if (operation === 'create' && data?.original_url && !data?.cover_url) {
          try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 6000)
            const res = await fetch(data.original_url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Rotorbladet/1.0; +https://rotorbladet.se)',
                Accept: 'text/html',
              },
              signal: controller.signal,
              redirect: 'follow',
            })
            clearTimeout(timeout)
            if (res.ok) {
              const html = (await res.text()).slice(0, 150000)
              const patterns = [
                /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
                /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
                /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
                /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
              ]
              for (const pattern of patterns) {
                const match = html.match(pattern)
                if (match?.[1]) {
                  let img = match[1].trim()
                  if (img.startsWith('//')) img = 'https:' + img
                  else if (img.startsWith('/')) {
                    const url = new URL(data.original_url)
                    img = url.origin + img
                  }
                  data.cover_url = img
                  break
                }
              }
            }
          } catch {
            // Silent fail - cover_url stays empty
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'original_url',
      type: 'text',
      label: 'Original URL',
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'nyheter',
      options: [
        { label: 'Reglering', value: 'reglering' },
        { label: 'Utrustning', value: 'utrustning' },
        { label: 'Utbildning', value: 'utbildning' },
        { label: 'Nyheter', value: 'nyheter' },
        { label: 'Affärer', value: 'affarer' },
      ],
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Nyckelord/taggar (t.ex. "dji", "mavic-4", "eu-förbud")',
      },
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cover_url',
      type: 'text',
      label: 'Cover Image URL',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'ai_processed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Utvald artikel',
      admin: {
        position: 'sidebar',
        description: 'Visa denna artikel i utvald-sektionen på startsidan',
      },
    },
    {
      name: 'clickCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
