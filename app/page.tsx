export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid #1e293b', background: '#0d1117', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🔐</span>
          <span style={{ color: '#d4af37', fontWeight: 800, fontSize: 20 }}>ITS-R SSO</span>
        </div>
      </header>
      <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', padding: '5rem 1.5rem', width: '100%' }}>
        <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 800, marginBottom: 16 }}>
          <span style={{ color: '#d4af37' }}>ITS-R</span> Single Sign-On
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 40 }}>
          The authentication bridge of ITS-R Universe. One identity, seamless access to all services.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
          {[
            { icon: '🔗', title: 'OAuth 2.0', desc: 'Standard authorization code flow for all ITS-R services.' },
            { icon: '✅', title: 'Token Validation', desc: 'Any service can validate user tokens via /api/validate.' },
            { icon: '🛂', title: 'Passport Integration', desc: 'Seamlessly connects with ITS-R Passport identity system.' },
            { icon: '⚡', title: 'Instant Auth', desc: 'Sub-second token validation for real-time access control.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 28 }}>
          <h2 style={{ color: '#d4af37', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Integration Endpoints</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { method: 'GET', path: '/authorize', desc: 'Start OAuth 2.0 authorization flow' },
              { method: 'POST', path: '/api/oauth/token', desc: 'Exchange authorization code for token' },
              { method: 'GET', path: '/api/validate', desc: 'Validate access token (used by all services)' },
              { method: 'GET', path: '/api/userinfo', desc: 'Get user info from Bearer token' },
            ].map(e => (
              <div key={e.path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1a1a2e' }}>
                <span style={{ padding: '3px 8px', background: e.method === 'GET' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', color: e.method === 'GET' ? '#34d399' : '#fbbf24', borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: 'monospace', minWidth: 48, textAlign: 'center' }}>{e.method}</span>
                <code style={{ color: '#d4af37', fontSize: 14, fontFamily: 'monospace' }}>{e.path}</code>
                <span style={{ color: '#64748b', fontSize: 13 }}>{e.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer style={{ borderTop: '1px solid #1e293b', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>ITS-R Universe</p>
        <p style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>In loving memory of Roshan Ali Sahab</p>
      </footer>
    </div>
  )
}
