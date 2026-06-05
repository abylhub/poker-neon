import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePlayers, useGames, useActiveSeason } from '../hooks/useData.js'
import { buildLeaderboard } from '../data/scoring.js'
import Avatar from '../components/Avatar.jsx'

const RANK_SUIT  = { 1: '♠', 2: '♥', 3: '♦', 4: '♣' }
const RANK_COLOR = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' }

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="text-3xl" style={{ color: 'rgba(255,215,0,0.3)', animation: 'spin 2s linear infinite', display: 'inline-block' }}>♠</div>
      <div className="label">Загрузка...</div>
    </div>
  )
}

export default function Leaderboard() {
  const { season, loading: sl } = useActiveSeason()
  const { players, loading: pl } = usePlayers()
  const { games,   loading: gl } = useGames()

  const seasonGames = useMemo(() =>
    games.filter(g => g.seasonId === season?.id && g.status === 'completed' && !g.isSpecial),
    [games, season])

  const board  = useMemo(() => buildLeaderboard(players, seasonGames), [players, seasonGames])
  const pmap   = Object.fromEntries(players.map(p => [p.id, p]))
  const leader = board[0]
  const lp     = leader ? pmap[leader.playerId] : null

  if (sl || pl || gl) return <Spinner />

  if (!season) return (
    <div className="text-center py-24">
      <div className="text-5xl mb-6" style={{ color: 'rgba(255,215,0,0.2)', fontFamily: 'serif' }}>♠</div>
      <div className="dh text-xl mb-2" style={{ color: 'rgba(232,222,255,0.4)' }}>Нет активного сезона</div>
      <p className="font-sans text-sm mb-8" style={{ color: 'rgba(232,222,255,0.2)' }}>Создайте сезон в Admin панели</p>
      <Link to="/admin" className="btn btn-gold">Открыть Admin</Link>
    </div>
  )

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="label mb-1.5">Текущий сезон</div>
          <h1 className="dh text-2xl" style={{ color: '#f0e6ff' }}>{season.name}</h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs" style={{ color: 'rgba(232,222,255,0.25)' }}>
          <span>{seasonGames.length} игр</span>
          <span className="text-lg" style={{ color: 'rgba(255,215,0,0.2)', fontFamily: 'serif' }}>♦</span>
        </div>
      </div>

      {/* ── Season Leader Hero ── */}
      {lp && (
        <div className="card mb-6 p-6 relative overflow-hidden holo-bg" style={{ borderColor: 'rgba(255,215,0,0.22)' }}>
          {/* Corner decorations */}
          <div style={{ position:'absolute', top:8, left:8, color:'rgba(255,215,0,0.3)', fontFamily:'serif', fontSize:12 }}>A♠</div>
          <div style={{ position:'absolute', bottom:8, right:8, color:'rgba(255,215,0,0.3)', fontFamily:'serif', fontSize:12, transform:'rotate(180deg)' }}>A♠</div>
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 70% at 30% 50%, rgba(255,215,0,0.05), transparent)' }}/>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="glow-pulse rounded-full"><Avatar player={lp} size={80} glow="gold" /></div>
              <div className="absolute -bottom-1 -right-2 text-2xl">👑</div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="label mb-1">Season Leader</div>
              <div className="dh text-2xl mb-4" style={{ color: '#f0e6ff', textShadow: '0 0 20px rgba(255,215,0,0.2)' }}>{lp.name}</div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                {[
                  { val: leader.seasonPoints,    label: 'Best 7',  color: '#ffd700', suit: '♠' },
                  { val: leader.wins,            label: 'Победы', color: '#ff2d78', suit: '♥' },
                  { val: leader.totalKnockouts,  label: 'Нокауты', color: '#00ff9f', suit: '♦' },
                  { val: leader.gamesPlayed,     label: 'Игр',    color: 'rgba(232,222,255,0.4)', suit: '♣' },
                ].map(({ val, label, color, suit }) => (
                  <div key={label} className="flex flex-col items-center sm:items-start">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono font-600 text-2xl" style={{ color, textShadow: `0 0 12px ${color}66` }}>{val}</span>
                      <span style={{ color, fontFamily: 'serif', fontSize: 11, opacity: 0.6 }}>{suit}</span>
                    </div>
                    <span className="label" style={{ fontSize: '8px' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Leaderboard table ── */}
      {board.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="divider mb-6"><span className="suit-divider"/></div>
          <div className="dh text-lg mb-2" style={{ color: 'rgba(232,222,255,0.3)' }}>Игры ещё не сыграны</div>
          <p className="font-sans text-sm mb-6" style={{ color: 'rgba(232,222,255,0.2)' }}>Начните первую игру сезона</p>
          <Link to="/live/setup" className="btn btn-pink"><span className="mr-2" style={{ fontFamily: 'serif' }}>♦</span>Начать игру</Link>
        </div>
      ) : (
        <div className="card-plain overflow-hidden" style={{ border: '1px solid rgba(255,215,0,0.15)' }}>
          <table className="w-full">
            <thead>
              <tr className="label text-[9px]" style={{ borderBottom: '1px solid rgba(255,215,0,0.12)', background: 'rgba(255,215,0,0.03)' }}>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">Игрок</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Игр</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell" style={{ color: 'rgba(255,45,120,0.5)' }}>♥ W</th>
                <th className="px-4 py-3 text-center hidden sm:table-cell" style={{ color: 'rgba(0,255,159,0.5)' }}>♦ KO</th>
                <th className="px-4 py-3 text-right" style={{ color: 'rgba(255,215,0,0.7)' }}>♠ Best 7</th>
              </tr>
            </thead>
            <tbody>
              {board.map((e, i) => {
                const p = pmap[e.playerId]
                const rankColor = RANK_COLOR[e.rank]
                const isTop3 = e.rank <= 3
                return (
                  <tr key={e.playerId}
                    className="transition-all"
                    style={{ borderBottom: '1px solid rgba(255,215,0,0.06)', background: i === 0 ? 'rgba(255,215,0,0.04)' : 'transparent', cursor: 'pointer' }}
                    onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,215,0,0.06)'}
                    onMouseLeave={ev => ev.currentTarget.style.background = i === 0 ? 'rgba(255,215,0,0.04)' : 'transparent'}>
                    <td className="px-4 py-3">
                      {isTop3 ? (
                        <div className="flex items-center gap-1">
                          <span className="font-sans font-700 text-base" style={{ color: rankColor, textShadow: `0 0 10px ${rankColor}88` }}>{e.rank}</span>
                          <span style={{ color: rankColor, fontFamily: 'serif', fontSize: 12, opacity: 0.7 }}>{RANK_SUIT[e.rank]}</span>
                        </div>
                      ) : (
                        <span className="font-mono text-sm" style={{ color: 'rgba(232,222,255,0.25)' }}>{e.rank}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/player/${e.playerId}`} className="flex items-center gap-3">
                        <Avatar player={p} size={36} glow={i === 0 ? 'gold' : 'pink'} />
                        <div>
                          <div className="font-sans font-500 text-sm" style={{ color: i === 0 ? '#f0e6ff' : 'rgba(232,222,255,0.65)' }}>{p?.name || '—'}</div>
                          <div className="font-mono text-[10px] sm:hidden" style={{ color: 'rgba(232,222,255,0.3)' }}>{e.gamesPlayed}г · {e.wins}W · {e.totalKnockouts}KO</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{ color: 'rgba(232,222,255,0.35)' }}>{e.gamesPlayed}</td>
                    <td className="px-4 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{ color: 'rgba(255,45,120,0.7)' }}>{e.wins}</td>
                    <td className="px-4 py-3 text-center font-mono text-sm hidden sm:table-cell" style={{ color: 'rgba(0,255,159,0.7)' }}>{e.totalKnockouts}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono font-600 text-lg" style={{
                        color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'rgba(232,222,255,0.5)',
                        textShadow: i === 0 ? '0 0 12px rgba(255,215,0,0.6)' : 'none'
                      }}>{e.seasonPoints}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Table footer */}
          <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,215,0,0.08)', background: 'rgba(255,215,0,0.02)' }}>
            <span className="font-mono text-[10px]" style={{ color: 'rgba(232,222,255,0.2)' }}>* зачёт: 7 лучших результатов</span>
            <span style={{ color: 'rgba(255,215,0,0.2)', fontFamily: 'serif', fontSize: 14, letterSpacing: 6 }}>♠ ♥ ♦ ♣</span>
          </div>
        </div>
      )}
    </div>
  )
}
