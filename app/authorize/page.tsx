'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AuthorizeContent() {
  const params = useSearchParams()
  const client_id = params.get('client_id') || ''
  const redirect_uri = params.get('redirect_uri') || ''
  const state = params.get('state') || ''
  const [client, setClient] = useState<{ name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string; passport_id: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const check = async () => {
      if (!client_id || !redirect_uri) { setError('Invalid request — missing client_id or redirect_uri'); setLoading(false); return }
      const [clientRes, userRes] = await Promise.all([
        fetch(`/api/sso-client?client_id=${client_id}`),
        fetch('https://its-r-passport.vercel.app/api/auth/me', { credentials: 'include' })
      ])
      const clientData = await clientRes.json()
      if (!clientRes.ok) { setError('Unknown application'); setLoading(false); return }
      setClient(clientData)
      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData.user)
      }
      setLoading(false)
    }
    check()
  }, [client_id, redirect_uri])

  const handleAllow = async () => {
    const res = await fetch('/api/oauth/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, redirect_uri, state }),
      credentials: 'include'
    })
    const data = await res.json()
    if (data.code) {
      const url = new URL(redirect_uri)
      url.searchParams.set('code', data.code)
      if (state) url.searchParams.set('state', state)
      window.location.href = url.toString()
    }
  }

  const handleDeny = () => {
    const url = new URL(redirect_uri)
    url.searchParams.set('error', 'access_denied')
    if (state) url.searchParams.set('state', state)
    window.location.href = url.toString()
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#d4af37', fontSize: 18 }}>Verifying...</div></div>
  if (error) return <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#f87171', background: '#0d1117', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 32 }}>{error}</div></div>

  if (!user) {
    const loginUrl = `https://its-r-passport.vercel.app/login?redirect=${encodeURIComponent(window.location.href)}`
    window.location.href = loginUrl
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#0d1117', border: '1px solid #1e293b', borderRadius: 20, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Authorization Request</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            <strong style={{ color: '#d4af37' }}>{client?.name}</strong> wants to access your ITS-R identity
          </p>
        </div>

        <div style={{ background: '#0a0a0f', border: '1px solid #1e293b', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>Signing in as:</p>
          <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>{user.name}</p>
          <p style={{ color: '#64748b', fontSize: 13 }}>{user.email}</p>
          <p style={{ color: '#d4af37', fontFamily: 'monospace', fontSize: 12, marginTop: 4 }}>{user.passport_id}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={handleAllow} style={{ padding: '13px', background: '#d4af37', color: '#000', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 10, cursor: 'pointer' }}>
            Allow Access
          </button>
          <button onClick={handleDeny} style={{ padding: '13px', background: 'transparent', color: '#94a3b8', fontSize: 15, border: '1px solid #1e293b', borderRadius: 10, cursor: 'pointer' }}>
            Deny
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Authorize() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}><AuthorizeContent /></Suspense>
}
