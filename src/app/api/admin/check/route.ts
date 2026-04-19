import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const user = await payload.auth({
      headers: req.headers,
    })

    return NextResponse.json({
      admin: !!user,
    })
  } catch {
    return NextResponse.json({
      admin: false,
    })
  }
}
