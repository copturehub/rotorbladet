import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
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
        { label: 'Affärer', value: 'affärer' },
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
