import { Link, useNavigate } from 'react-router-dom'
import { adminLogout, addSeason, closeSeason } from '../../lib/db.js'
import { usePlayers, useGames, useActiveSeason, useSeasons } from '../../hooks/useData.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { players } = usePlayers()
  const { games } = useGames()
  const { season } = useActiveSeason()
  const { seasons } = useSeasons()

  function logout() { adminLogout(); navigate('/admin') }

  async function newSeason() {
    const name = prompt('Название сезона:', `Сезон ${new Date().getFullYear()}`)
    if (name) await addSeason(name)
  }

  async function endSeason() {
    if (!season) return
    if (confirm(`Закрыть "${season.name}"?`)) await closeSeason(season.id)
  }

  return (
    <div className="min-h-screen p-4" style={{ background: '#050510' }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="font-display text-neon-cyan text-lg tracking-widest">ADMIN</div>
          <button onClick={logout} className="text-white/30 hover:text-white/60 text-xs">Выйти</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[{ val: players.length, label: 'Игроков' }, { val: games.filter(g => g.status === 'completed').length, label: 'Игр' }].map(({ val, label }) => (
            <div key={label} className="card p-4 text-center">
              <div className="font-mono font-bold text-2xl neon-cyan mb-1">{val}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>

        <div className="card p-4 mb-4">
          <div className="label mb-3">Текущий сезон</div>
          {season ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">{season.name}</span>
              <button onClick={endSeason} className="btn btn-pink" style={{ padding: '6px 12px', fontSize: '10px' }}>Закрыть</button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/30">Нет активного сезона</span>
              <button onClick={newSeason} className="btn btn-cyan" style={{ padding: '6px 12px', fontSize: '10px' }}>Создать</button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {[
            { to: '/admin/players', label: 'Управление игроками' },
            { to: '/live/setup', label: 'Начать новую игру' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="block card p-4 hover:border-neon-cyan/25 transition-all text-sm text-white/60 hover:text-white/90">{label} →</Link>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-white/25 text-xs hover:text-white/50">← На сайт</Link>
        </div>
      </div>
    </div>
  )
}
