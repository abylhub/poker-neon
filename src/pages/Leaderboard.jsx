import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePlayers, useGames, useActiveSeason } from '../hooks/useData.js'
import { buildLeaderboard } from '../data/scoring.js'
import Avatar from '../components/Avatar.jsx'

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-t-[#ff2d78] animate-spin" style={{ borderColor: 'rgba(255,45,120,0.2)', borderTopColor: '#ff2d78' }} />
    </div>
  )
}

export default function Leaderboard() {
  const { season, loading: sl } = useActiveSeason()
  const { players, loading: pl } = usePlayers()
  const { games, loading: gl } = useGames()

  const seasonGames = useMemo(() =>
    games.filter(g => g.seasonId === season?.id && g.status === 'completed' && !g.isSpecial),
    [games, season])

  const board = useMemo(() => buildLeaderboard(players, seasonGames), [players, seasonGames])
  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const leader = board[0]
  const lp = leader ? pmap[leader.playerId] : null

  if (sl || pl || gl) return <Spinner />

  if (!season) return (
    <div className="text-center py-24">
      <div className="font-display text-4xl mb-4 opacity-20 vc-pink">♠</div>
      <div className="font-display text-lg mb-2 font-400" style={{ color: 'rgba(240,230,255,0.4)' }}>Нет активного сезона</div>
      <p className="text-sm mb-8 font-body" style={{ color: 'rgba(240,230,255,0.25)' }}>Создайте сезон в Admin панели</p>
      <Link to="/admin" className="btn btn-teal">Открыть Admin</Link>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="label mb-1">Текущий сезон</div>
          <h1 className="casino-heading text-xl">{season.name}</h1>
        </div>
        <div className="font-mono text-xs" style={{ color: 'rgba(240,230,255,0.25)' }}>{seasonGames.length} игр</div>
      </div>

      {/* Hero — Season Leader */}
      {lp && (
        <div className="card mb-6 p-5 relative overflow-hidden sunset-bg" style={{ borderColor: 'rgba(255,45,120,0.25)' }}>
          {/* decorative corner lines */}
          <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none" style={{ borderTop: '2px solid #ff2d78', borderLeft: '2px solid #ff2d78', opacity: 0.5 }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none" style={{ borderBottom: '2px solid #00d4ff', borderRight: '2px solid #00d4ff', opacity: 0.5 }} />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="glow-pulse rounded-full">
                <Avatar player={lp} size={76} glow="pink" />
              </div>
              <div className="absolute -bottom-1 -right-1 text-xl">👑</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="label mb-1.5">Season Leader</div>
              <div className="casino-heading text-2xl mb-4" style={{ textShadow: '0 0 20px rgba(255,45,120,0.3)' }}>{lp.name}</div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                {[
                  { val: leader.seasonPoints, label: 'Best 7',  color: '#ff2d78' },
                  { val: leader.wins,         label: 'Победы', color: '#00d4ff' },
                  { val: leader.totalKnockouts, label: 'KO',   color: '#06ffa5' },
                  { val: leader.gamesPlayed,  label: 'Игр',    color: 'rgba(240,230,255,0.4)' },
                ].map(({ val, label, color }) => (
                  <div key={label} className="flex flex-col items-center sm:items-start">
                    <span className="font-mono font-500 text-2xl" style={{ color, textShadow: `0 0 10px ${color}55` }}>{val}</span>
                    <span className="label" style={{ fontSize: '8px' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      {board.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-3xl mb-4 opacity-20">♣</div>
          <div className="font-body text-sm mb-6" style={{ color: 'rgba(240,230,255,0.3)' }}>Игры ещё не сыграны</div>
          <Link to="/live/setup" className="btn btn-pink">Начать игру</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="label text-[9px]" style={{ borderBottom: '1px solid rgba(255,45,120,0.1)' }}>
                <th className="px-3 py-3 text-left w-10">#</th>
                <th className="px-3 py-3 text-left">Игрок</th>
                <th className="px-3 py-3 text-center hidden sm:table-cell">Игр</th>
                <th className="px-3 py-3 text-center hidden sm:table-cell" style={{ color: 'rgba(0,212,255,0.5)' }}>W</th>
                <th className="px-3 py-3 text-center hidden sm:table-cell" style={{ color: 'rgba(6,255,165,0.5)' }}>KO</th>
                <th className="px-3 py-3 text-right" style={{ color: 'rgba(255,45,120,0.7)' }}>Best 7</th>
              </tr>
            </thead>
            <tbody>
              {board.map((e, i) => {
                const p = pmap[e.playerId]
                return (
                  <tr key={e.playerId}
                    className="transition-all"
                    style={{
                      borderBottom: '1px solid rgba(255,45,120,0.06)',
                      background: i === 0 ? 'rgba(255,45,120,0.04)' : 'transparent',
                    }}
                    onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,45,120,0.06)'}
                    onMouseLeave={ev => ev.currentTarget.style.background = i === 0 ? 'rgba(255,45,120,0.04)' : 'transparent'}
                  >
                    <td className="px-3 py-3">
                      {MEDAL[e.rank]
                        ? <span className={`text-lg ${i === 0 ? 'glow-pulse' : ''}`}>{MEDAL[e.rank]}</span>
                        : <span className="font-mono text-sm" style={{ color: 'rgba(240,230,255,0.25)' }}>{e.rank}</span>}
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/player/${e.playerId}`} className="flex items-center gap-2.5" style={{ opacity: 0.9 }}>
                        <Avatar player={p} size={36} glow={i === 0 ? 'pink' : 'teal'} />
                        <div>
                          <div className="font-body font-500 text-sm" style={{ color: i === 0 ? '#f0e6ff' : 'rgba(240,230,255,0.7)' }}>{p?.name || '—'}</div>
                          <div className="font-mono text-[10px] sm:hidden" style={{ color: 'rgba(240,230,255,0.3)' }}>{e.gamesPlayed}г · {e.wins}W · {e.totalKnockouts}KO</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{ color: 'rgba(240,230,255,0.35)' }}>{e.gamesPlayed}</td>
                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{ color: 'rgba(0,212,255,0.6)' }}>{e.wins}</td>
                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{ color: 'rgba(6,255,165,0.6)' }}>{e.totalKnockouts}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-mono font-500 text-lg" style={{
                        color: i === 0 ? '#ff2d78' : i === 1 ? 'rgba(240,230,255,0.75)' : 'rgba(240,230,255,0.5)',
                        textShadow: i === 0 ? '0 0 10px rgba(255,45,120,0.6)' : 'none'
                      }}>{e.seasonPoints}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="font-mono text-[10px] mt-3 text-right" style={{ color: 'rgba(240,230,255,0.2)' }}>* зачёт: 7 лучших результатов</p>
    </div>
  )
}
