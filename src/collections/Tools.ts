import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tool_category', 'source', 'createdAt'],
    group: 'Innehåll',
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data?.name && (operation === 'create' || !data.slug)) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[åä]/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
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
        if (operation === 'create' && data?.url && !data?.cover_url) {
          try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 6000)
            const res = await fetch(data.url, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (compatible; Rotorbladet/1.0; +https://rotorbladet.se)',
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
                    const url = new URL(data.url)
                    img = url.origin + img
                  }
                  data.cover_url = img
                  break
                }
              }
            }
          } catch {
            // Silent fail
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Namn',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL till tjänsten',
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
      label: 'Beskrivning',
      admin: {
        description: 'Kort beskrivning av vad tjänsten gör och varför den är användbar.',
      },
    },
    {
      name: 'tool_category',
      type: 'select',
      required: true,
      defaultValue: 'verktyg',
      label: 'Kategori',
      options: [
        { label: '🗺️ Kartor & luftrum', value: 'kartor' },
        { label: '☁️ Väder', value: 'vader' },
        { label: '⚖️ Regler & tillstånd', value: 'regler' },
        { label: '📚 Utbildning & certifiering', value: 'utbildning' },
        { label: '🛠️ Verktyg & appar', value: 'verktyg' },
        { label: '🏢 Myndigheter & organisationer', value: 'myndighet' },
      ],
    },
    {
      name: 'source',
      type: 'text',
      label: 'Källa / domän',
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Nyckelord (t.ex. "lfv", "drönarkarta", "luftrum")',
      },
    },
    {
      name: 'cover_url',
      type: 'text',
      label: 'Bild-URL',
      admin: {
        position: 'sidebar',
        description: 'Fylls i automatiskt via og:image om tomt.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Visa som utvald',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
