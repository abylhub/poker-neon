import { Link } from 'react-router-dom'
import { getAllCompletedGames, getPlayers } from '../data/store.js'
import { getResults } from '../data/scoring.js'
import Avatar from '../components/Avatar.jsx'

export default function Games() {
  const games = getAllCompletedGames()
  const players = getPlayers()
  const pmap = Object.fromEntries(players.map(p=>[p.id,p]))

  if (games.length===0) return (
    <div className="text-center py-20">
      <div className="text-white/20 text-3xl mb-4">♦</div>
      <div className="text-white/30 text-sm mb-6">Игры ещё не сыграны</div>
      <Link to="/live/setup" className="btn btn-cyan">Начать игру</Link>
    </div>
  )

  return (
    <div>
      <div className="mb-5">
        <div className="label mb-1">История</div>
        <h1 className="font-display text-lg text-white">Все игры</h1>
      </div>

      <div className="space-y-3">
        {games.map(g=>{
          const results = getResults(g).sort((a,b)=>a.place-b.place)
          const winner = results[0]
          const wp = winner ? pmap[winner.playerId] : null
          const date = new Date(g.date).toLocaleDateString('ru', {day:'numeric',month:'short',year:'numeric'})
          return (
            <Link key={g.id} to={`/game/${g.id}`} className="block card p-4 hover:border-neon-cyan/25 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={g.isSpecial?'badge-special':'badge-season'}>{g.isSpecial?'Special':'Season'}</span>
                  {g.title && <span className="text-sm text-white/60">{g.title}</span>}
                </div>
                <span className="font-mono text-xs text-white/25">{date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {wp && <><Avatar player={wp} size={32}/><span className="text-sm text-white/70">{wp.name}</span><span className="text-[10px] font-mono neon-cyan ml-1">{winner.totalPoints}pts</span></>}
                </div>
                <div className="flex items-center gap-1">
                  {results.slice(0,5).map(r=><Avatar key={r.playerId} player={pmap[r.playerId]} size={24}/>)}
                  {results.length>5 && <span className="text-[10px] text-white/30 ml-1">+{results.length-5}</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
