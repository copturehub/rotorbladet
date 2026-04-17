import type { CollectionConfig } from 'payload'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'status', 'sentAt', 'recipientCount'],
    description: 'Nyhetsbrev som skickas till prenumeranter',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'actions',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/NewsletterActions',
        },
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Ämnesrad - det som syns i inkorgen',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      admin: {
        description: 'Förhandstext som syns i mailklienten efter ämnet (max ~100 tecken)',
      },
      maxLength: 150,
    },
    {
      name: 'introText',
      type: 'textarea',
      admin: {
        description: 'Valfri introduktionstext högst upp i mailet',
      },
    },
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      required: true,
      admin: {
        description: 'Välj artiklar att inkludera (drag för att sortera)',
      },
    },
    {
      name: 'outroText',
      type: 'textarea',
      admin: {
        description: 'Valfri avslutningstext längst ner i mailet',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Utkast', value: 'draft' },
        { label: 'Schemalagt', value: 'scheduled' },
        { label: 'Skickat', value: 'sent' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'När nyhetsbrevet skickades',
      },
    },
    {
      name: 'recipientCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Antal mottagare',
      },
    },
    {
      name: 'openCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'clickCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
