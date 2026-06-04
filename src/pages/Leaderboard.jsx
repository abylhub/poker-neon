import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getActiveSeason, getSeasonGames, getPlayers } from '../data/store.js'
import { buildLeaderboard } from '../data/scoring.js'
import Avatar from '../components/Avatar.jsx'

const MEDAL = { 1:'🥇', 2:'🥈', 3:'🥉' }
const GLOW = { 1:'0 0 30px rgba(0,245,255,0.4)', 2:'0 0 15px rgba(192,192,255,0.3)', 3:'0 0 15px rgba(205,127,50,0.3)' }

export default function Leaderboard() {
  const season = getActiveSeason()
  const players = getPlayers()
  const games = season ? getSeasonGames(season.id) : []
  const board = useMemo(() => buildLeaderboard(players, games), [players.length, games.length])
  const pmap = Object.fromEntries(players.map(p=>[p.id,p]))
  const leader = board[0]
  const lp = leader ? pmap[leader.playerId] : null

  if (!season) return (
    <div className="text-center py-24">
      <div className="font-display text-4xl neon-cyan opacity-20 mb-4">♠</div>
      <div className="font-display text-lg text-white/40 mb-2">Нет активного сезона</div>
      <p className="text-white/25 text-sm mb-8">Создайте сезон в Admin панели</p>
      <Link to="/admin" className="btn btn-cyan">Admin</Link>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="label mb-1">Текущий сезон</div>
          <h1 className="font-display text-lg text-white">{season.name}</h1>
        </div>
        <div className="font-mono text-xs text-white/25">{games.length} игр</div>
      </div>

      {/* Hero banner */}
      {lp && (
        <div className="card mb-6 p-5 relative overflow-hidden" style={{borderColor:'rgba(0,245,255,0.2)', background:'linear-gradient(135deg,rgba(0,245,255,0.04),rgba(255,0,255,0.02))'}}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-10" style={{background:'radial-gradient(circle,#00f5ff,transparent)',transform:'translate(30%,-30%)'}}/>
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative flex-shrink-0">
              <Avatar player={lp} size={72} glow="cyan"/>
              <div className="absolute -bottom-1 -right-1 text-xl">👑</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="label mb-1">Season Leader</div>
              <div className="font-display text-2xl text-white mb-3" style={{textShadow:'0 0 20px rgba(0,245,255,0.3)'}}>{lp.name}</div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-5">
                {[
                  { val:leader.seasonPoints, label:'Best 7', color:'#00f5ff' },
                  { val:leader.wins, label:'Победы', color:'#ff00ff' },
                  { val:leader.totalKnockouts, label:'Нокауты', color:'#7fff00' },
                  { val:leader.gamesPlayed, label:'Игр', color:'rgba(224,224,255,0.5)' },
                ].map(({val,label,color}) => (
                  <div key={label} className="flex flex-col items-center sm:items-start">
                    <span className="font-mono font-bold text-xl" style={{color, textShadow:`0 0 8px ${color}66`}}>{val}</span>
                    <span className="label" style={{fontSize:'8px'}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {board.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-white/20 mb-3 text-3xl">♣</div>
          <div className="text-white/30 text-sm mb-6">Игры ещё не сыграны</div>
          <Link to="/live/setup" className="btn btn-cyan">Начать игру</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 label" style={{fontSize:'9px'}}>
                <th className="px-3 py-3 text-left w-10">#</th>
                <th className="px-3 py-3 text-left">Игрок</th>
                <th className="px-3 py-3 text-center hidden sm:table-cell">Игр</th>
                <th className="px-3 py-3 text-center hidden sm:table-cell" style={{color:'rgba(255,0,255,0.5)'}}>W</th>
                <th className="px-3 py-3 text-center hidden sm:table-cell" style={{color:'rgba(127,255,0,0.5)'}}>KO</th>
                <th className="px-3 py-3 text-right" style={{color:'rgba(0,245,255,0.7)'}}>Best 7</th>
              </tr>
            </thead>
            <tbody>
              {board.map((e, i) => {
                const p = pmap[e.playerId]
                const isFirst = i===0
                return (
                  <tr key={e.playerId}
                    className="border-b border-white/[0.04] transition-all hover:bg-neon-cyan/[0.03]"
                    style={isFirst ? {background:'rgba(0,245,255,0.03)',boxShadow:GLOW[1]} : {}}>
                    <td className="px-3 py-3">
                      {MEDAL[e.rank]
                        ? <span className={`text-lg ${isFirst?'glow-pulse':''}`}>{MEDAL[e.rank]}</span>
                        : <span className="font-mono text-sm text-white/25">{e.rank}</span>}
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/player/${e.playerId}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <Avatar player={p} size={36}/>
                        <div>
                          <div className={`text-sm font-medium ${isFirst?'text-white':'text-white/70'}`}>{p?.name||'—'}</div>
                          <div className="text-[10px] text-white/30 font-mono sm:hidden">{e.gamesPlayed}г · {e.wins}W · {e.totalKnockouts}KO</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-sm text-white/35 hidden sm:table-cell">{e.gamesPlayed}</td>
                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{color:'rgba(255,0,255,0.6)'}}>{e.wins}</td>
                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{color:'rgba(127,255,0,0.6)'}}>{e.totalKnockouts}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-mono font-bold text-lg" style={{color: i===0?'#00f5ff':i===1?'rgba(224,224,255,0.8)':'rgba(224,224,255,0.5)', textShadow:i===0?'0 0 8px rgba(0,245,255,0.6)':'none'}}>
                        {e.seasonPoints}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] text-white/20 mt-3 text-right font-mono">* зачёт: 7 лучших результатов</p>
    </div>
  )
}
