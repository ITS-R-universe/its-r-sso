import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { supabaseAdmin } from '@/lib/supabase'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 })

    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (!payload.sub) return NextResponse.json({ valid: false }, { status: 401 })

    const { data: tokenRecord } = await supabaseAdmin.from('its_r_sso_tokens').select('*').eq('access_token', token).gt('expires_at', new Date().toISOString()).single()
    if (!tokenRecord) {
      const { payload: p } = await jwtVerify(token, JWT_SECRET).catch(() => ({ payload: null }))
      if (!p) return NextResponse.json({ valid: false }, { status: 401 })
    }

    const { data: user } = await supabaseAdmin.from('its_r_users').select('id, passport_id, full_name, email, avatar_url').eq('id', payload.sub).single()
    if (!user) return NextResponse.json({ valid: false }, { status: 401 })

    return NextResponse.json({ valid: true, user: { id: user.id, passport_id: user.passport_id, name: user.full_name, email: user.email, avatar_url: user.avatar_url } })
  } catch {
    return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 })
  }
}
