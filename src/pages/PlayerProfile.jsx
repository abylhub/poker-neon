import { useParams, Link } from 'react-router-dom'
import { usePlayers, useGames, useActiveSeason } from '../hooks/useData.js'
import { calcPlayerStats, buildLeaderboard } from '../data/scoring.js'
import { useMemo } from 'react'
import Avatar from '../components/Avatar.jsx'

export default function PlayerProfile() {
  const { id } = useParams()
  const { players, loading: pl } = usePlayers()
  const { games, loading: gl } = useGames()
  const { season } = useActiveSeason()

  const player = players.find(p => p.id === id)
  const seasonGames = useMemo(() => games.filter(g => g.seasonId === season?.id && g.status === 'completed' && !g.isSpecial), [games, season])
  const stats = useMemo(() => player ? calcPlayerStats(id, seasonGames) : null, [id, seasonGames, player])
  const board = useMemo(() => buildLeaderboard(players, seasonGames), [players, seasonGames])
  const rank = board.find(e => e.playerId === id)?.rank ?? '—'

  if (pl || gl) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" /></div>
  if (!player) return <div className="text-center py-20"><Link to="/" className="btn btn-cyan">На главную</Link></div>

  const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/" className="text-white/30 hover:text-white/60 text-xs mb-4 inline-block">← Рейтинг</Link>

      <div className="card p-5 mb-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <Avatar player={player} size={72} glow="cyan" />
        <div className="flex-1">
          <div className="font-display text-2xl text-white mb-1">{player.name}</div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
            <span className="font-mono text-3xl font-bold neon-cyan">{typeof rank === 'number' && rank <= 3 ? MEDAL[rank] : `#${rank}`}</span>
            {season && <span className="badge-season">{season.name}</span>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: stats?.gamesPlayed ?? 0, label: 'Игр' },
              { val: stats?.wins ?? 0, label: 'Побед', color: '#ff00ff' },
              { val: stats?.totalKnockouts ?? 0, label: 'Нокауты', color: '#7fff00' },
              { val: stats?.top3 ?? 0, label: 'Топ-3' },
              { val: stats?.best ?? 0, label: 'Рекорд', color: '#00f5ff' },
              { val: stats?.seasonPoints ?? 0, label: 'Best 7', color: '#00f5ff' },
            ].map(({ val, label, color }) => (
              <div key={label} className="bg-white/[0.03] rounded p-2 text-center">
                <div className="font-mono font-bold text-lg" style={{ color: color || 'rgba(224,224,255,0.7)' }}>{val}</div>
                <div className="label" style={{ fontSize: '8px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats?.rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 label">Сезонные игры</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04] label text-[9px]">
                <th className="px-3 py-2 text-left">Дата</th>
                <th className="px-3 py-2 text-center">Место</th>
                <th className="px-3 py-2 text-center" style={{ color: 'rgba(127,255,0,0.5)' }}>KO</th>
                <th className="px-3 py-2 text-right" style={{ color: 'rgba(0,245,255,0.6)' }}>Очки</th>
              </tr>
            </thead>
            <tbody>
              {stats.rows.map(r => {
                const inTop = stats.counted.has(r.gameId)
                return (
                  <tr key={r.gameId} className={`border-b border-white/[0.04] last:border-0 ${inTop ? 'bg-neon-cyan/[0.025]' : ''}`}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {inTop && <span className="text-[8px] neon-cyan font-display">★</span>}
                        <span className="text-xs text-white/40 font-mono">{new Date(r.date).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono text-sm text-white/60">{r.place <= 3 ? ['🥇', '🥈', '🥉'][r.place - 1] : r.place}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-sm" style={{ color: 'rgba(127,255,0,0.6)' }}>{r.knockouts > 0 ? `+${r.knockouts}` : '—'}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-sm" style={{ color: inTop ? '#00f5ff' : 'rgba(224,224,255,0.4)' }}>{r.points}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-4 py-2 border-t border-white/5 text-[10px] text-white/25 font-mono">★ идёт в зачёт Best 7</div>
        </div>
      )}
    </div>
  )
}
