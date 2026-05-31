import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { supabaseAdmin } from '@/lib/supabase'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { grant_type, code, client_id, client_secret, redirect_uri } = body

    if (grant_type !== 'authorization_code') return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 })
    if (!code || !client_id || !client_secret) return NextResponse.json({ error: 'invalid_request' }, { status: 400 })

    const { data: client } = await supabaseAdmin.from('its_r_sso_clients').select('*').eq('client_id', client_id).single()
    if (!client) return NextResponse.json({ error: 'invalid_client' }, { status: 401 })

    const secretValid = await bcrypt.compare(client_secret, client.client_secret_hash)
    if (!secretValid) return NextResponse.json({ error: 'invalid_client' }, { status: 401 })

    if (!client.redirect_uris.includes(redirect_uri)) return NextResponse.json({ error: 'invalid_grant' }, { status: 400 })

    const { data: authCode } = await supabaseAdmin.from('its_r_oauth_codes').select('*').eq('code', code).eq('app_id', client.id).gt('expires_at', new Date().toISOString()).eq('used', false).single()
    if (!authCode) return NextResponse.json({ error: 'invalid_grant' }, { status: 400 })

    await supabaseAdmin.from('its_r_oauth_codes').update({ used: true }).eq('id', authCode.id)

    const { data: user } = await supabaseAdmin.from('its_r_users').select('id, passport_id, full_name, email, avatar_url').eq('id', authCode.user_id).single()
    if (!user) return NextResponse.json({ error: 'invalid_grant' }, { status: 400 })

    const access_token = await new SignJWT({ sub: user.id, email: user.email, name: user.full_name, client_id, passport_id: user.passport_id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    const expires_at = new Date(Date.now() + 86400 * 1000).toISOString()
    await supabaseAdmin.from('its_r_sso_tokens').insert({ user_id: user.id, client_id, access_token, expires_at })

    return NextResponse.json({ access_token, token_type: 'Bearer', expires_in: 86400, scope: 'identity' })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
