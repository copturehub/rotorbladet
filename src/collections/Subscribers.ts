import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'subscribedAt'],
    description: 'Prenumeranter på nyhetsbrevet',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // Anyone can subscribe via public form
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Avregistrerad', value: 'unsubscribed' },
        { label: 'Studsade', value: 'bounced' },
      ],
      index: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Var prenumererade användaren? (t.ex. "homepage-hero")',
      },
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Unik token för avprenumerationslänk',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value) return value
            return crypto.randomBytes(32).toString('hex')
          },
        ],
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
