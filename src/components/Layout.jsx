import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useLiveGame } from '../hooks/useData.js'
import CyberpunkBackground from './PalmBackground.jsx'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const liveGame = useLiveGame()
  const close = () => setOpen(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#07050f' }}>
      <CyberpunkBackground />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl"
        style={{ background: 'rgba(7,5,15,0.92)', borderBottom: '1px solid rgba(255,215,0,0.12)' }}>
        <div className="gold-line" />
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: 'rgba(255,215,0,0.6)', fontFamily: 'serif' }}>♠</span>
              <div className="flex flex-col leading-none">
                <span className="font-sans font-700 text-sm tracking-[0.3em] uppercase neon-pink">Poker</span>
                <span className="dh-light text-[10px] tracking-[0.5em] uppercase" style={{ color: 'rgba(255,215,0,0.6)' }}>League</span>
              </div>
              <span className="text-lg" style={{ color: 'rgba(255,215,0,0.6)', fontFamily: 'serif' }}>♠</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center">
            {[['/', 'Рейтинг'], ['/games', 'Игры'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-xs font-sans font-500 tracking-widest uppercase transition-all ${
                    isActive ? 'neon-gold' : 'text-[rgba(232,222,255,0.35)] hover:text-[rgba(255,215,0,0.7)]'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded"
                style={{ border: '1px solid rgba(255,45,120,0.5)', background: 'rgba(255,45,120,0.1)', color: '#ff2d78' }}>
                <span className="live-dot" />
                <span className="hidden sm:inline font-sans text-[9px] tracking-widest font-600">LIVE</span>
              </Link>
            )}
            <Link to="/live/setup" onClick={close} className="btn btn-gold" style={{ padding: '7px 16px', fontSize: '10px' }}>
              <span className="mr-1.5" style={{ fontFamily: 'serif' }}>♦</span>Игра
            </Link>
            <Link to="/admin" onClick={close} className="hidden sm:block font-sans text-[10px] px-2 py-1.5 tracking-widest uppercase"
              style={{ color: 'rgba(232,222,255,0.15)' }}>Admin</Link>
            <button onClick={() => setOpen(v => !v)} className="sm:hidden p-2 rounded"
              style={{ border: '1px solid rgba(255,215,0,0.2)' }}>
              <div className="flex flex-col gap-1">
                {[open ? 'rotate-45 translate-y-1.5' : '', open ? 'opacity-0' : '', open ? '-rotate-45 -translate-y-1.5' : ''].map((cls, i) => (
                  <span key={i} className={`block w-4 h-0.5 transition-all ${cls}`} style={{ background: '#ffd700' }} />
                ))}
              </div>
            </button>
          </div>
        </div>
        <div className="gold-line" />
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden fixed top-14 left-0 right-0 z-20 border-b px-4 py-3 flex flex-col gap-0.5"
          style={{ borderColor: 'rgba(255,215,0,0.1)', background: 'rgba(7,5,15,0.98)', backdropFilter: 'blur(20px)' }}>
          {[['/', '♠ Рейтинг'], ['/games', '♥ Игры'], ['/knockouts', '♦ Нокауты'], ['/seasons', '♣ Сезоны'], ['/admin', '· Admin']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}
              className={({ isActive }) =>
                `px-3 py-3 text-sm font-sans font-500 tracking-wider transition-all ${
                  isActive ? 'neon-gold' : 'text-[rgba(232,222,255,0.45)]'
                }`
              }>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="relative z-10 py-5" style={{ borderTop: '1px solid rgba(255,215,0,0.08)' }}>
        <div className="gold-line mb-4" />
        <div className="text-center">
          <span className="font-sans font-300 text-[9px] tracking-[0.6em] uppercase" style={{ color: 'rgba(232,222,255,0.12)' }}>
            ♠ Poker League · Cyberpunk Casino Edition ♠
          </span>
        </div>
      </footer>
    </div>
  )
}
