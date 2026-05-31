import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { supabaseAdmin } from '@/lib/supabase'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Bearer token required' }, { status: 401 })
    const token = auth.replace('Bearer ', '')
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (!payload.sub) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const { data: user } = await supabaseAdmin.from('its_r_users').select('id, passport_id, full_name, email, avatar_url, email_verified, created_at').eq('id', payload.sub).single()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ id: user.id, passport_id: user.passport_id, name: user.full_name, email: user.email, avatar_url: user.avatar_url, email_verified: user.email_verified, created_at: user.created_at })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
