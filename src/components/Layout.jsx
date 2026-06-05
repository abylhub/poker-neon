import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useLiveGame } from '../hooks/useData.js'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const liveGame = useLiveGame()
  const close = () => setOpen(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0818' }}>
      {/* Retro grid background */}
      <div className="fixed inset-0 pointer-events-none retro-grid" />
      {/* Subtle radial glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(157,0,255,0.12) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: 'rgba(13,8,24,0.88)', borderBottom: '1px solid rgba(255,45,120,0.15)' }}>
        <div className="vc-line" />
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-3 flex-shrink-0">
            <div className="flex flex-col leading-none">
              <span className="font-display text-sm font-500 tracking-widest" style={{ color: '#ff2d78', textShadow: '0 0 15px rgba(255,45,120,0.7)' }}>POKER</span>
              <span className="font-display text-[9px] font-400 tracking-[0.4em]" style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>LEAGUE</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {[['/', 'Рейтинг'], ['/games', 'Игры'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-xs tracking-wider font-body font-500 transition-all rounded-sm ${
                    isActive
                      ? 'text-[#ff2d78] bg-[rgba(255,45,120,0.08)]'
                      : 'text-[rgba(240,230,255,0.45)] hover:text-[#ff2d78]/80'
                  }`
                }>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {liveGame && (
              <Link to={`/live/${liveGame.id}`} onClick={close}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs"
                style={{ border: '1px solid rgba(255,45,120,0.4)', background: 'rgba(255,45,120,0.08)', color: '#ff2d78' }}>
                <span className="live-dot" />
                <span className="hidden sm:inline font-display text-[9px] tracking-wider">LIVE</span>
              </Link>
            )}
            <Link to="/live/setup" onClick={close} className="btn btn-pink" style={{ padding: '7px 14px' }}>+ Игра</Link>
            <Link to="/admin" onClick={close} className="hidden sm:block text-xs px-2 py-1.5 transition-colors" style={{ color: 'rgba(240,230,255,0.2)' }}>Admin</Link>

            {/* Burger */}
            <button onClick={() => setOpen(v => !v)} className="sm:hidden p-2 rounded" style={{ border: '1px solid rgba(255,45,120,0.2)' }}>
              <div className="flex flex-col gap-1">
                <span className={`block w-4 h-0.5 transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} style={{ background: '#ff2d78' }} />
                <span className={`block w-4 h-0.5 transition-all ${open ? 'opacity-0' : ''}`} style={{ background: '#ff2d78' }} />
                <span className={`block w-4 h-0.5 transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} style={{ background: '#ff2d78' }} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden border-t px-4 py-2 flex flex-col gap-0.5" style={{ borderColor: 'rgba(255,45,120,0.1)', background: 'rgba(13,8,24,0.97)' }}>
            {[['/', 'Рейтинг'], ['/games', 'История игр'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны'], ['/admin', 'Admin']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={close}
                className={({ isActive }) => `px-3 py-3 rounded text-sm font-body transition-all ${isActive ? 'text-[#ff2d78]' : 'text-[rgba(240,230,255,0.5)]'}`}>
                {label}
              </NavLink>
            ))}
          </div>
        )}
        <div className="vc-line" />
      </header>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="relative z-10 py-4 text-center" style={{ borderTop: '1px solid rgba(255,45,120,0.1)' }}>
        <div className="vc-line mb-3" />
        <span className="font-display text-[9px] tracking-[0.4em] font-400" style={{ color: 'rgba(240,230,255,0.15)' }}>POKER LEAGUE · VICE EDITION</span>
      </footer>
    </div>
  )
}
