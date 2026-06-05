import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkAdminPassword, setAdminPassword, adminLogin, isAdminPasswordSet } from '../../lib/db.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function handle(e) {
    e.preventDefault()
    if (!pw.trim()) return
    setLoading(true); setErr('')
    const hasPassword = await isAdminPasswordSet()
    if (!hasPassword) { await setAdminPassword(pw); adminLogin(); navigate('/admin/dashboard'); return }
    const ok = await checkAdminPassword(pw)
    if (ok) { adminLogin(); navigate('/admin/dashboard') }
    else { setErr('Неверный пароль'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0d0818' }}>
      <div className="w-full max-w-sm">
        <div className="vc-line mb-8" />
        <div className="text-center mb-8">
          <div className="font-display text-2xl font-400 mb-1" style={{ color: '#ff2d78', textShadow: '0 0 20px rgba(255,45,120,0.6)', letterSpacing: '0.3em' }}>ADMIN</div>
          <div className="font-display text-xs font-400 tracking-[0.4em]" style={{ color: '#00d4ff', opacity: 0.6 }}>POKER LEAGUE</div>
        </div>
        <div className="card p-6" style={{ borderColor: 'rgba(255,45,120,0.2)' }}>
          <form onSubmit={handle} className="space-y-4">
            <div>
              <div className="label mb-2">Пароль</div>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" autoFocus
                className="w-full rounded px-3 py-2.5 text-sm font-mono outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,45,120,0.2)', color: '#f0e6ff' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,45,120,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,45,120,0.2)'} />
              <div className="text-[10px] font-mono mt-1.5" style={{ color: 'rgba(240,230,255,0.2)' }}>При первом входе — любой пароль станет паролем admin</div>
            </div>
            {err && <div className="text-xs font-body" style={{ color: '#ff6b6b' }}>{err}</div>}
            <button type="submit" disabled={loading || !pw.trim()} className="btn btn-solid w-full">
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
          </form>
        </div>
        <div className="vc-line mt-8" />
        <div className="text-center mt-4">
          <a href="/#/" className="font-body text-xs transition-colors" style={{ color: 'rgba(240,230,255,0.2)' }}>← На сайт</a>
        </div>
      </div>
    </div>
  )
}
