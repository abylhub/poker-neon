import { useParams, Link } from 'react-router-dom'
import { useGame, usePlayers } from '../hooks/useData.js'
import { getResults } from '../data/scoring.js'
import Avatar from '../components/Avatar.jsx'

const PC = { 1: '#00f5ff', 2: '#c0c0ff', 3: '#cd7f32' }

export default function GameDetail() {
  const { id } = useParams()
  const { game, loading } = useGame(id)
  const { players } = usePlayers()

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" /></div>
  if (!game) return <div className="text-center py-20"><Link to="/games" className="btn btn-cyan">Назад</Link></div>

  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const results = getResults(game).sort((a, b) => a.place - b.place)
  const top3 = results.slice(0, 3)
  const date = new Date(game.date).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/games" className="text-white/30 hover:text-white/60 text-xs mb-4 inline-block">← Назад</Link>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={game.isSpecial ? 'badge-special' : 'badge-season'}>{game.isSpecial ? 'Special' : 'Season'}</span>
          </div>
          <h1 className="font-display text-lg text-white">{game.title || date}</h1>
          {game.title && <div className="text-xs text-white/30 font-mono mt-0.5">{date}</div>}
        </div>
      </div>

      {top3.length >= 2 && (
        <div className="flex items-end justify-center gap-3 mb-6">
          {[top3[1], top3[0], top3[2]].filter(Boolean).map((r) => {
            const p = pmap[r.playerId]
            const pos = r.place
            const h = pos === 1 ? 'h-28' : pos === 2 ? 'h-20' : 'h-16'
            const color = PC[pos]
            return (
              <div key={r.playerId} className="flex flex-col items-center" style={{ order: pos === 1 ? 2 : pos === 2 ? 1 : 3 }}>
                <Avatar player={p} size={pos === 1 ? 56 : 44} glow="cyan" />
                <div className="text-xs text-white/60 mt-1 mb-1">{p?.name}</div>
                <div className="font-mono font-bold text-sm" style={{ color }}>{r.totalPoints}pts</div>
                <div className={`${h} w-16 rounded-t mt-2 flex items-start justify-center pt-1`} style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <span className="font-display text-lg" style={{ color }}>{['🥇', '🥈', '🥉'][pos - 1]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04] label text-[9px]">
              <th className="px-3 py-2 text-left w-10">Место</th>
              <th className="px-3 py-2 text-left">Игрок</th>
              <th className="px-3 py-2 text-center">Очки</th>
              <th className="px-3 py-2 text-center" style={{ color: 'rgba(127,255,0,0.5)' }}>KO</th>
              <th className="px-3 py-2 text-right" style={{ color: 'rgba(0,245,255,0.6)' }}>Итого</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => {
              const p = pmap[r.playerId]
              const color = PC[r.place] || 'rgba(224,224,255,0.4)'
              return (
                <tr key={r.playerId} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-3 py-2.5"><span className="font-mono font-bold" style={{ color }}>{r.place <= 3 ? ['🥇', '🥈', '🥉'][r.place - 1] : r.place}</span></td>
                  <td className="px-3 py-2.5">
                    <Link to={`/player/${r.playerId}`} className="flex items-center gap-2 hover:opacity-75">
                      <Avatar player={p} size={28} /><span className="text-sm text-white/75">{p?.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-sm text-white/35">{r.pointsForPlace ?? r.points}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-sm" style={{ color: 'rgba(127,255,0,0.6)' }}>{r.knockouts > 0 ? `+${r.knockouts}` : '—'}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-sm" style={{ color: r.place <= 3 ? color : 'rgba(224,224,255,0.5)' }}>{r.totalPoints ?? r.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
