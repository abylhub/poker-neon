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
    if (!hasPassword) {
      await setAdminPassword(pw)
      adminLogin()
      navigate('/admin/dashboard')
      return
    }
    const ok = await checkAdminPassword(pw)
    if (ok) { adminLogin(); navigate('/admin/dashboard') }
    else { setErr('Неверный пароль'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#050510' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-neon-cyan text-xl font-bold tracking-widest mb-1" style={{ textShadow: '0 0 15px rgba(0,245,255,0.5)' }}>ADMIN</div>
          <div className="label">Poker League</div>
        </div>
        <div className="card p-6">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <div className="label mb-2">Пароль</div>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" autoFocus
                className="w-full bg-dark-800 border border-neon-cyan/20 rounded px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-neon-cyan/50 font-mono" />
              <div className="text-[10px] text-white/25 mt-1">При первом входе — любой пароль станет паролем admin</div>
            </div>
            {err && <div className="text-red-400 text-xs">{err}</div>}
            <button type="submit" disabled={loading || !pw.trim()} className="btn btn-solid w-full">
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
          </form>
        </div>
        <div className="text-center mt-4"><a href="/#/" className="text-white/25 text-xs hover:text-white/50">← На сайт</a></div>
      </div>
    </div>
  )
}
