import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useLiveGame } from '../hooks/useData.js'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const liveGame = useLiveGame()
  const close = () => setOpen(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050510' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur-md" style={{ background: 'rgba(5,5,16,0.85)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" onClick={close} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded border border-neon-cyan/40 flex items-center justify-center" style={{ boxShadow: '0 0 8px rgba(0,245,255,0.2)' }}>
              <span className="font-display text-neon-cyan text-[9px] font-bold">PL</span>
            </div>
            <span className="font-display text-neon-cyan text-xs font-bold tracking-widest hidden sm:block" style={{ textShadow: '0 0 12px rgba(0,245,255,0.5)' }}>Poker League</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {[['/', 'Рейтинг'], ['/games', 'Игры'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) => `px-3 py-2 rounded text-xs tracking-wide transition-all ${isActive ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30' : 'text-white/40 hover:text-neon-cyan/80 hover:bg-neon-cyan/5'}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {liveGame && (
              <Link to={`/live/${liveGame.id}`} onClick={close} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-red-500/40 bg-red-500/10 text-red-400 text-xs">
                <span className="live-dot" /><span className="hidden sm:inline font-display text-[9px] tracking-wider">LIVE</span>
              </Link>
            )}
            <Link to="/live/setup" onClick={close} className="btn btn-pink" style={{ padding: '7px 14px', fontSize: '10px' }}>+ Игра</Link>
            <Link to="/admin" onClick={close} className="text-white/20 hover:text-white/50 text-xs px-2 py-1.5 hidden sm:block">Admin</Link>
            <button onClick={() => setOpen(v => !v)} className="sm:hidden flex flex-col gap-1 p-2 border border-neon-cyan/20 rounded">
              <span className={`block w-4 h-0.5 bg-neon-cyan transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-4 h-0.5 bg-neon-cyan transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-4 h-0.5 bg-neon-cyan transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {open && (
          <div className="sm:hidden border-t border-white/5 px-4 py-2 flex flex-col gap-1" style={{ background: 'rgba(5,5,16,0.95)' }}>
            {[['/', 'Рейтинг'], ['/games', 'История игр'], ['/knockouts', 'Нокауты'], ['/seasons', 'Сезоны'], ['/admin', 'Admin']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={close}
                className={({ isActive }) => `px-3 py-3 rounded text-sm transition-all ${isActive ? 'text-neon-cyan bg-neon-cyan/10' : 'text-white/50'}`}>
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/5 py-3 text-center font-display text-[9px] tracking-widest text-white/15">
        POKER LEAGUE · NEON
      </footer>
    </div>
  )
}
