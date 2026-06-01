'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SSOHandler() {
  const params = useSearchParams()
  const redirect = params.get('redirect') || 'https://its-r-portal.vercel.app'
  const service = params.get('service') || 'ITS-R Universe'
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    const isDark = t !== 'light'
    setDark(isDark)
    if (!isDark) document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme','dark') }
    else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('its-r-theme','light') }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',padding:'1rem 2rem',borderBottom:'1px solid var(--border)'}}>
        <span style={{color:'var(--gold)',fontWeight:800}}>🔐 ITS-R SSO</span>
        <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>
          {dark?'☀️':'🌙'}
        </button>
      </nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{textAlign:'center',maxWidth:400}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔐</div>
          <h1 style={{fontSize:'1.5rem',fontWeight:700,marginBottom:'0.5rem'}}>Single Sign-On</h1>
          <p style={{color:'var(--sub)',marginBottom:'2rem',fontSize:'0.9rem'}}>{service} is requesting access to your ITS-R account</p>
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1.5rem',marginBottom:'1.5rem'}}>
            <p style={{fontSize:'0.85rem',color:'var(--sub)',marginBottom:'1rem'}}>You will be redirected to ITS-R Passport to sign in</p>
            <a href={`https://its-r-passport.vercel.app/login?redirect=${encodeURIComponent(redirect)}`} style={{display:'block',background:'var(--gold)',color:'#000',padding:'0.75rem',borderRadius:'0.5rem',fontWeight:700,textDecoration:'none',fontSize:'0.9rem'}}>
              🛂 Sign in with ITS-R Passport
            </a>
          </div>
          <p style={{fontSize:'0.75rem',color:'var(--sub)'}}>
            ITS-R Universe • In loving memory of Roshan Ali Sahab 🤲
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SSOPage() {
  return <Suspense><SSOHandler /></Suspense>
}
