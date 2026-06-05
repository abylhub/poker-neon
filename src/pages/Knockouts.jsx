import { Link } from 'react-router-dom'
import { useGames, usePlayers } from '../hooks/useData.js'
import Avatar from '../components/Avatar.jsx'

export default function Knockouts() {
  const { players, loading: pl } = usePlayers()
  const { games, loading: gl } = useGames()

  if (pl || gl) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" /></div>

  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const matrix = {}
  const totalKilled = {}

  for (const game of games.filter(g => g.status === 'completed')) {
    for (const e of (game.eliminated || [])) {
      if (!e.eliminatedBy) continue
      if (!matrix[e.eliminatedBy]) matrix[e.eliminatedBy] = {}
      matrix[e.eliminatedBy][e.playerId] = (matrix[e.eliminatedBy][e.playerId] || 0) + 1
      totalKilled[e.eliminatedBy] = (totalKilled[e.eliminatedBy] || 0) + 1
    }
  }

  const killers = players.map(p => ({ player: p, kills: totalKilled[p.id] || 0 })).filter(x => x.kills > 0).sort((a, b) => b.kills - a.kills)

  const duels = []
  for (const killerId of Object.keys(matrix)) {
    for (const victimId of Object.keys(matrix[killerId])) {
      const key = [killerId, victimId].sort().join('-')
      if (!duels.find(d => d.key === key)) {
        duels.push({ key, a: pmap[killerId], b: pmap[victimId], aKills: matrix[killerId][victimId], bKills: matrix[victimId]?.[killerId] || 0 })
      }
    }
  }
  duels.sort((a, b) => (b.aKills + b.bKills) - (a.aKills + a.bKills))

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-5"><div className="label mb-1">Статистика</div><h1 className="font-display text-lg text-white">История нокаутов</h1></div>

      {killers.length === 0 ? (
        <div className="card p-12 text-center text-white/25 text-sm">Нокаутов ещё не зафиксировано</div>
      ) : (
        <>
          <div className="card overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <span className="neon-green text-base">⚡</span><span className="label">Топ нокаутёров</span>
            </div>
            {killers.map((x, i) => (
              <div key={x.player.id} className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0">
                <span className="font-mono text-sm text-white/25 w-5">{i + 1}</span>
                <Avatar player={x.player} size={36} />
                <Link to={`/player/${x.player.id}`} className="flex-1 text-sm text-white/75 hover:text-white">{x.player.name}</Link>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-lg neon-green">{x.kills}</span>
                  <span className="label text-[9px]">KO</span>
                </div>
              </div>
            ))}
          </div>

          {duels.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <span className="text-base">⚔️</span><span className="label">Дуэли</span>
              </div>
              {duels.slice(0, 10).map(d => {
                const aWins = d.aKills >= d.bKills
                return (
                  <div key={d.key} className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar player={d.a} size={32} glow={aWins ? 'green' : 'cyan'} />
                      <span className="text-sm text-white/70 truncate">{d.a?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 flex-shrink-0">
                      <span className="font-mono font-bold text-base" style={{ color: aWins ? '#7fff00' : 'rgba(224,224,255,0.4)' }}>{d.aKills}</span>
                      <span className="text-white/20 text-xs">:</span>
                      <span className="font-mono font-bold text-base" style={{ color: !aWins ? '#7fff00' : 'rgba(224,224,255,0.4)' }}>{d.bKills}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="text-sm text-white/70 truncate">{d.b?.name}</span>
                      <Avatar player={d.b} size={32} glow={!aWins ? 'green' : 'cyan'} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
