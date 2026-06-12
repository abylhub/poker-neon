import { Link } from 'react-router-dom'
import { useGames, usePlayers } from '../hooks/useData.js'
import { deleteGame } from '../lib/db.js'
import { isAdminLoggedIn } from '../lib/db.js'
import { getResults } from '../data/scoring.js'
import Avatar from '../components/Avatar.jsx'
import { useToast } from '../components/Toast.jsx'

function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,45,120,0.2)', borderTopColor: '#ff2d78' }} /></div>
}

export default function Games() {
  const { games, loading } = useGames()
  const { players } = usePlayers()
  const toast = useToast()
  const isAdmin = isAdminLoggedIn()
  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const completed = games.filter(g => g.status === 'completed').sort((a, b) => b.date - a.date)

  if (loading) return <Spinner />

  async function handleDelete(e, gameId) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Удалить эту игру?')) return
    try {
      await deleteGame(gameId)
      toast('Игра удалена', 'error')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  if (completed.length === 0) return (
    <div className="text-center py-20">
      <div className="text-3xl mb-4 opacity-20">♦</div>
      <div className="font-body text-sm mb-6" style={{ color: 'rgba(240,230,255,0.3)' }}>Игры ещё не сыграны</div>
      <Link to="/live/setup" className="btn btn-pink">Начать игру</Link>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="label mb-1">История</div>
          <h1 className="font-display text-lg font-400" style={{ color: '#f0e6ff' }}>Все игры</h1>
        </div>
        <span className="font-mono text-xs" style={{ color: 'rgba(240,230,255,0.25)' }}>{completed.length} игр</span>
      </div>

      <div className="space-y-2">
        {completed.map(g => {
          const results = getResults(g).sort((a, b) => a.place - b.place)
          const winner = results[0]
          const wp = winner ? pmap[winner.playerId] : null
          const date = new Date(g.date).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' })

          return (
            <Link key={g.id} to={`/game/${g.id}`} className="group block card p-4 transition-all"
              style={{ borderColor: 'rgba(255,45,120,0.12)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.12)'}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={g.isSpecial ? 'badge-special' : 'badge-season'}>{g.isSpecial ? 'Special' : 'Season'}</span>
                  {g.title && <span className="font-body text-sm" style={{ color: 'rgba(240,230,255,0.6)' }}>{g.title}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs" style={{ color: 'rgba(232,222,255,0.25)' }}>{date}</span>
                  {isAdmin && (
                    <button onClick={e => handleDelete(e, g.id)}
                      className="text-xs px-2 py-1 rounded transition-all"
                      style={{ color: 'rgba(255,45,120,0.5)', border: '1px solid rgba(255,45,120,0.18)' }}
                      onMouseEnter={e => { e.target.style.color='#ff2d78'; e.target.style.borderColor='rgba(255,45,120,0.5)' }}
                      onMouseLeave={e => { e.target.style.color='rgba(255,45,120,0.5)'; e.target.style.borderColor='rgba(255,45,120,0.18)' }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {wp && (
                    <>
                      <Avatar player={wp} size={32} glow="pink" />
                      <span className="font-body font-500 text-sm" style={{ color: 'rgba(240,230,255,0.7)' }}>{wp.name}</span>
                      <span className="font-mono text-[10px] vc-pink">{winner.totalPoints}pts</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {results.slice(0, 5).map(r => <Avatar key={r.playerId} player={pmap[r.playerId]} size={24} glow="teal" />)}
                  {results.length > 5 && <span className="font-mono text-[10px] ml-1" style={{ color: 'rgba(240,230,255,0.3)' }}>+{results.length - 5}</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
