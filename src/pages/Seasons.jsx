import { useSeasons, useGames } from '../hooks/useData.js'
import { isAdminLoggedIn, deleteSeason, closeSeason, addSeason } from '../lib/db.js'
import { useToast } from '../components/Toast.jsx'

export default function Seasons() {
  const { seasons, loading } = useSeasons()
  const { games } = useGames()
  const toast = useToast()
  const isAdmin = isAdminLoggedIn()

  async function handleDelete(season) {
    const gameCount = games.filter(g => g.seasonId === season.id).length
    const msg = gameCount > 0
      ? `Удалить сезон "${season.name}" и ${gameCount} игр в нём? Это действие необратимо.`
      : `Удалить сезон "${season.name}"?`
    if (!confirm(msg)) return
    await deleteSeason(season.id)
    toast(`Сезон "${season.name}" удалён`, 'error')
  }

  async function handleClose(season) {
    if (!confirm(`Закрыть сезон "${season.name}"?`)) return
    await closeSeason(season.id)
    toast(`Сезон "${season.name}" закрыт`)
  }

  async function handleNew() {
    const name = prompt('Название сезона:', `Сезон ${new Date().getFullYear()}`)
    if (name?.trim()) {
      await addSeason(name.trim())
      toast(`Сезон "${name.trim()}" создан`)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="label">Загрузка...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="label mb-1.5">Архив</div>
          <h1 className="dh text-2xl" style={{ color: '#f0e6ff' }}>Сезоны</h1>
        </div>
        {isAdmin && (
          <button onClick={handleNew} className="btn btn-gold" style={{ padding: '7px 16px', fontSize: '10px' }}>
            + Сезон
          </button>
        )}
      </div>

      {seasons.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4" style={{ color: 'rgba(255,215,0,0.15)', fontFamily: 'serif' }}>♦</div>
          <div className="font-sans text-sm" style={{ color: 'rgba(232,222,255,0.3)' }}>Сезонов ещё нет</div>
        </div>
      ) : (
        <div className="space-y-3">
          {seasons.map(s => {
            const gameCount = games.filter(g => g.seasonId === s.id).length
            return (
              <div key={s.id} className="card p-4 flex items-center justify-between gap-3"
                style={{ borderColor: s.isActive ? 'rgba(255,215,0,0.25)' : 'rgba(255,215,0,0.1)' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <span style={{ color: 'rgba(255,215,0,0.4)', fontFamily: 'serif', fontSize: 18 }}>
                    {s.isActive ? '♠' : '♣'}
                  </span>
                  <div className="min-w-0">
                    <div className="font-sans font-600 text-sm" style={{ color: s.isActive ? '#f0e6ff' : 'rgba(232,222,255,0.55)' }}>
                      {s.name}
                    </div>
                    <div className="font-mono text-[10px] mt-0.5" style={{ color: 'rgba(232,222,255,0.25)' }}>
                      {new Date(s.createdAt).toLocaleDateString('ru')} · {gameCount} игр
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.isActive
                    ? <span className="badge-season">Активный</span>
                    : <span className="font-mono text-[10px]" style={{ color: 'rgba(232,222,255,0.25)' }}>Завершён</span>
                  }

                  {isAdmin && (
                    <div className="flex items-center gap-1.5 ml-2">
                      {s.isActive && (
                        <button onClick={() => handleClose(s)}
                          className="font-sans text-[10px] px-2.5 py-1.5 rounded transition-all"
                          style={{ border: '1px solid rgba(255,215,0,0.25)', color: 'rgba(255,215,0,0.6)' }}
                          onMouseEnter={e => { e.target.style.borderColor='rgba(255,215,0,0.5)'; e.target.style.color='#ffd700' }}
                          onMouseLeave={e => { e.target.style.borderColor='rgba(255,215,0,0.25)'; e.target.style.color='rgba(255,215,0,0.6)' }}>
                          Закрыть
                        </button>
                      )}
                      <button onClick={() => handleDelete(s)}
                        className="font-sans text-[10px] px-2.5 py-1.5 rounded transition-all"
                        style={{ border: '1px solid rgba(255,45,120,0.2)', color: 'rgba(255,45,120,0.5)' }}
                        onMouseEnter={e => { e.target.style.borderColor='rgba(255,45,120,0.5)'; e.target.style.color='#ff2d78' }}
                        onMouseLeave={e => { e.target.style.borderColor='rgba(255,45,120,0.2)'; e.target.style.color='rgba(255,45,120,0.5)' }}>
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!isAdmin && seasons.length > 0 && (
        <p className="font-mono text-[10px] mt-4 text-center" style={{ color: 'rgba(232,222,255,0.2)' }}>
          Для управления сезонами войдите как Admin
        </p>
      )}
    </div>
  )
}
