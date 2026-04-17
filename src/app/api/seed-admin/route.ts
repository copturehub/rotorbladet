import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // Check if user exists
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'gustav@copture.com' } },
      limit: 1,
    })

    const plainPassword = 'admin123'

    if (existing.docs.length > 0) {
      // Update existing user - Payload will hash the password
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          password: plainPassword,
        },
      })
      return NextResponse.json({ message: 'Admin user password updated to: admin123' })
    }

    // Create new user - Payload will hash the password automatically
    await payload.create({
      collection: 'users',
      data: {
        email: 'gustav@copture.com',
        password: plainPassword,
      },
    })

    return NextResponse.json({
      message: 'Admin user created. Login: gustav@copture.com / admin123',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
