import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useLiveGame } from '../hooks/useData.js'
import PalmBackground from './PalmBackground.jsx'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const liveGame = useLiveGame()
  const close = () => setOpen(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0d0818' }}>
      {/* Palm tree sunset background */}
      <PalmBackground />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: 'rgba(13,8,24,0.92)', borderBottom: '1px solid rgba(255,45,120,0.12)' }}>
        <div className="vc-line" />
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-3 flex-shrink-0">
            <div className="flex flex-col leading-none">
              <span className="font-casino font-500 tracking-widest text-sm" style={{ color: '#ff2d78', textShadow: '0 0 18px rgba(255,45,120,0.7)' }}>POKER</span>
              <span className="font-display font-500 text-[8px] tracking-[0.5em]" style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>LEAGUE</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-0.5">
            {[['/', 'Рейтинг'], ['/games', 'Игры'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-xs tracking-wider font-body font-500 transition-all ${
                    isActive ? 'text-[#ff2d78]' : 'text-[rgba(240,230,255,0.4)] hover:text-[rgba(255,45,120,0.75)]'
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
                <span className="hidden sm:inline font-display text-[9px] tracking-wider font-500">LIVE</span>
              </Link>
            )}
            <Link to="/live/setup" onClick={close} className="btn btn-pink" style={{ padding: '7px 14px' }}>+ Игра</Link>
            <Link to="/admin" onClick={close} className="hidden sm:block text-xs px-2 py-1.5" style={{ color: 'rgba(240,230,255,0.18)', fontFamily: 'Orbitron' }}>Admin</Link>
            <button onClick={() => setOpen(v => !v)} className="sm:hidden p-2 rounded" style={{ border: '1px solid rgba(255,45,120,0.2)' }}>
              <div className="flex flex-col gap-1">
                {[open ? 'rotate-45 translate-y-1.5' : '', open ? 'opacity-0' : '', open ? '-rotate-45 -translate-y-1.5' : ''].map((cls, i) => (
                  <span key={i} className={`block w-4 h-0.5 transition-all ${cls}`} style={{ background: '#ff2d78' }} />
                ))}
              </div>
            </button>
          </div>
        </div>
        <div className="vc-line" />
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden fixed top-14 left-0 right-0 z-20 border-b px-4 py-2 flex flex-col gap-0.5"
          style={{ borderColor: 'rgba(255,45,120,0.1)', background: 'rgba(13,8,24,0.98)', backdropFilter: 'blur(16px)' }}>
          {[['/', 'Рейтинг'], ['/games', 'История игр'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны'], ['/admin', 'Admin']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}
              className={({ isActive }) => `px-3 py-3 text-sm font-body font-500 transition-all ${isActive ? 'text-[#ff2d78]' : 'text-[rgba(240,230,255,0.5)]'}`}>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="relative z-10 py-4 text-center" style={{ borderTop: '1px solid rgba(255,45,120,0.1)' }}>
        <div className="vc-line mb-3" />
        <span className="font-display font-500 text-[9px] tracking-[0.5em]" style={{ color: 'rgba(240,230,255,0.15)' }}>POKER LEAGUE · VICE EDITION</span>
      </footer>
    </div>
  )
}
