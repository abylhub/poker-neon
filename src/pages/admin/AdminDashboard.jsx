import { Link, useNavigate } from 'react-router-dom'
import { adminLogout, addSeason, closeSeason } from '../../lib/db.js'
import { usePlayers, useGames, useActiveSeason } from '../../hooks/useData.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { players } = usePlayers()
  const { games } = useGames()
  const { season } = useActiveSeason()
  function logout() { adminLogout(); navigate('/admin') }
  async function newSeason() { const n = prompt('Название сезона:', `Сезон ${new Date().getFullYear()}`); if (n) await addSeason(n) }
  async function endSeason() { if (season && confirm(`Закрыть "${season.name}"?`)) await closeSeason(season.id) }

  return (
    <div className="min-h-screen p-4" style={{ background: '#0d0818' }}>
      <div className="max-w-lg mx-auto">
        <div className="vc-line mb-6" />
        <div className="flex items-center justify-between mb-6">
          <div className="font-display text-lg font-400 tracking-widest" style={{ color: '#ff2d78', textShadow: '0 0 15px rgba(255,45,120,0.5)' }}>ADMIN</div>
          <button onClick={logout} className="font-body text-xs transition-colors" style={{ color: 'rgba(240,230,255,0.3)' }}>Выйти</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[{ val: players.length, label: 'Игроков', color: '#ff2d78' }, { val: games.filter(g => g.status === 'completed').length, label: 'Игр', color: '#00d4ff' }].map(({ val, label, color }) => (
            <div key={label} className="card p-4 text-center" style={{ borderColor: `${color}25` }}>
              <div className="font-mono font-500 text-2xl mb-1" style={{ color, textShadow: `0 0 10px ${color}55` }}>{val}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>

        <div className="card p-4 mb-4">
          <div className="label mb-3">Текущий сезон</div>
          {season
            ? <div className="flex items-center justify-between">
                <span className="font-body font-500 text-sm" style={{ color: 'rgba(240,230,255,0.7)' }}>{season.name}</span>
                <button onClick={endSeason} className="btn btn-pink" style={{ padding: '6px 12px' }}>Закрыть</button>
              </div>
            : <div className="flex items-center justify-between">
                <span className="font-body text-sm" style={{ color: 'rgba(240,230,255,0.3)' }}>Нет активного сезона</span>
                <button onClick={newSeason} className="btn btn-teal" style={{ padding: '6px 12px' }}>Создать</button>
              </div>
          }
        </div>

        <div className="space-y-2">
          {[{ to: '/admin/players', label: 'Управление игроками' }, { to: '/live/setup', label: 'Начать новую игру' }].map(({ to, label }) => (
            <Link key={to} to={to} className="flex items-center justify-between card p-4 transition-all font-body font-500 text-sm"
              style={{ color: 'rgba(240,230,255,0.6)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)'}>
              {label} <span style={{ color: '#ff2d78' }}>→</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="font-body text-xs" style={{ color: 'rgba(240,230,255,0.2)' }}>← На сайт</Link>
        </div>
      </div>
    </div>
  )
}
