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
        style={{ background: 'rgba(7,5,15,0.78)', borderBottom: '1px solid rgba(240,230,255,0.07)' }}>
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
          <nav className="hidden sm:flex items-center gap-1 p-1 rounded-full"
            style={{ border: '1px solid rgba(240,230,255,0.07)', background: 'rgba(240,230,255,0.03)' }}>
            {[['/', 'Рейтинг'], ['/games', 'Игры'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `nav-pill ${isActive ? 'nav-pill-active' : 'text-[rgba(232,222,255,0.4)] hover:text-[rgba(255,215,0,0.75)]'}`
                }>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {liveGame && (
              <Link to={`/live/${liveGame.id}`} onClick={close}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ border: '1px solid rgba(255,45,120,0.5)', background: 'rgba(255,45,120,0.1)', color: '#ff5e97' }}>
                <span className="live-dot" />
                <span className="hidden sm:inline font-sans text-[9px] tracking-widest font-600">LIVE</span>
              </Link>
            )}
            <Link to="/live/setup" onClick={close} className="btn btn-gold" style={{ padding: '7px 16px', fontSize: '10px' }}>
              <span className="mr-1.5" style={{ fontFamily: 'serif' }}>♦</span>Игра
            </Link>
            <Link to="/admin" onClick={close} className="hidden sm:block font-sans text-[10px] px-2 py-1.5 tracking-widest uppercase"
              style={{ color: 'rgba(232,222,255,0.15)' }}>Admin</Link>
            <button onClick={() => setOpen(v => !v)} className="sm:hidden p-2 rounded-xl"
              style={{ border: '1px solid rgba(240,230,255,0.12)', background: 'rgba(240,230,255,0.04)' }}>
              <div className="flex flex-col gap-1">
                {[open ? 'rotate-45 translate-y-1.5' : '', open ? 'opacity-0' : '', open ? '-rotate-45 -translate-y-1.5' : ''].map((cls, i) => (
                  <span key={i} className={`block w-4 h-0.5 transition-all ${cls}`} style={{ background: '#ffd700' }} />
                ))}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden fixed top-14 left-3 right-3 z-20 px-2 py-2 flex flex-col gap-0.5 rounded-2xl"
          style={{ border: '1px solid rgba(240,230,255,0.08)', background: 'rgba(10,7,20,0.96)', backdropFilter: 'blur(20px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
          {[['/', '♠ Рейтинг'], ['/games', '♥ Игры'], ['/knockouts', '♦ Нокауты'], ['/seasons', '♣ Сезоны'], ['/admin', '· Admin']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-sans font-500 tracking-wider rounded-xl transition-all ${
                  isActive ? 'nav-pill-active' : 'text-[rgba(232,222,255,0.45)]'
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

      <footer className="relative z-10 py-5" style={{ borderTop: '1px solid rgba(240,230,255,0.06)' }}>
        <div className="text-center">
          <span className="font-sans font-300 text-[9px] tracking-[0.6em] uppercase" style={{ color: 'rgba(232,222,255,0.12)' }}>
            ♠ Poker League · Cyberpunk Casino Edition ♠
          </span>
        </div>
      </footer>
    </div>
  )
}
