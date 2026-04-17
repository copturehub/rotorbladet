import { NextRequest, NextResponse } from 'next/server'

// Echo endpoint - returns exactly what was received. For debugging Make mappings.
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  let parsed: unknown = null
  try {
    parsed = JSON.parse(rawBody)
  } catch {
    parsed = null
  }
  return NextResponse.json({
    received: parsed,
    raw: rawBody,
    headers: Object.fromEntries(req.headers.entries()),
  })
}
