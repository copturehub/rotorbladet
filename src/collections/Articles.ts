import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
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
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
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
