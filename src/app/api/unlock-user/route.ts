import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'gustav@copture.com' } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Unlock user and reset password
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: {
        password: 'admin123',
        lockUntil: null,
        loginAttempts: 0,
      },
    })

    return NextResponse.json({ 
      message: 'User unlocked and password reset. Login: gustav@copture.com / admin123' 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
