import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getGame, getPlayers } from '../../data/store.js'
import Avatar from '../../components/Avatar.jsx'

const PC = { 1: '#00f5ff', 2: '#c0c0ff', 3: '#cd7f32' }

export default function LiveResults() {
  const { gameId } = useParams()
  const game = getGame(gameId)
  const players = getPlayers()
  if (!game) return <div className="text-center py-20"><Link to="/" className="btn btn-cyan">На главную</Link></div>

  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const results = [...(game.eliminated || [])].sort((a, b) => a.place - b.place)
  const winner = results[0]
  const wp = winner ? pmap[winner.playerId] : null

  return (
    <div className="max-w-xl mx-auto">
      {/* Победитель */}
      {wp && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-8">
          <div className="label mb-4">Победитель</div>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative inline-block mb-3">
            <div className="glow-pulse rounded-full inline-block"><Avatar player={wp} size={96} glow="cyan" /></div>
            <motion.div initial={{ rotate: -30, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-3 -right-3 text-3xl">👑</motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="font-display text-2xl text-white mb-1" style={{ textShadow: '0 0 25px rgba(0,245,255,0.4)' }}>{wp.name}</div>
            <div className="font-mono font-bold text-3xl neon-cyan">{winner.totalPoints} <span className="text-base text-neon-cyan/40">pts</span></div>
          </motion.div>
        </motion.div>
      )}

      {/* Таблица */}
      <div className="card overflow-hidden mb-5">
        <div className="px-4 py-3 border-b border-white/5 label">Итоги игры</div>
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
            {results.map((r, i) => {
              const p = pmap[r.playerId]
              const k = r.eliminatedBy ? pmap[r.eliminatedBy] : null
              const color = PC[r.place] || 'rgba(224,224,255,0.4)'
              return (
                <motion.tr key={r.playerId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                  className="border-b border-white/[0.04] last:border-0">
                  <td className="px-3 py-2.5">
                    <span className="font-mono font-bold text-base" style={{ color }}>{r.place <= 3 ? ['🥇', '🥈', '🥉'][r.place - 1] : r.place}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar player={p} size={28} />
                      <div>
                        <div className="text-sm text-white/80">{p?.name}</div>
                        {k && <div className="text-[10px] text-white/30">выбит: {k.name}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-sm text-white/40">{r.pointsForPlace}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-sm" style={{ color: 'rgba(127,255,0,0.6)' }}>{r.knockouts > 0 ? `+${r.knockouts}` : '—'}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-sm" style={{ color: r.place <= 3 ? color : 'rgba(224,224,255,0.5)' }}>{r.totalPoints}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-3">
        <Link to="/" className="btn btn-cyan flex-1">На главную</Link>
        <Link to="/live/setup" className="btn btn-pink flex-1">Новая игра</Link>
      </motion.div>
    </div>
  )
}
