import { motion } from 'framer-motion'
import Avatar from './Avatar.jsx'
import { shuffleSeating, advanceDealer } from '../lib/db.js'

// Овальный покерный стол с местами по кругу.
// Места фиксируются при создании игры (seating в документе игры);
// выбывшие остаются на своих стульях, но гаснут.
export default function SeatingTable({ game, players }) {
  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const seats = game.seating?.length ? game.seating : game.playerIds || []
  if (seats.length < 2) return null

  const elim = new Set((game.eliminated || []).map(e => e.playerId))
  const canShuffle = game.status === 'live' && !(game.eliminated?.length)
  const dealerId = seats[game.dealerSeat ?? 0]
  const n = seats.length

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="label">Рассадка</div>
        <div className="flex gap-1.5">
          {canShuffle && (
            <button onClick={() => shuffleSeating(game.id)}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-sans tracking-wider transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,230,255,0.55)' }}>
              🔀 Перемешать
            </button>
          )}
          {game.status === 'live' && (
            <button onClick={() => advanceDealer(game.id)}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-sans tracking-wider transition-all"
              style={{ border: '1px solid rgba(255,215,0,0.2)', color: 'rgba(255,215,0,0.65)' }}>
              Дилер →
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full mx-auto" style={{ aspectRatio: '14/10', maxWidth: 420 }}>
        {/* Сукно */}
        <div className="absolute rounded-[50%]"
          style={{
            inset: '18% 16%',
            background: 'radial-gradient(ellipse at 50% 40%, rgba(0,90,60,0.55), rgba(0,45,32,0.75))',
            border: '6px solid rgba(35,22,48,0.95)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,215,0,0.18), 0 12px 32px rgba(0,0,0,0.4)',
          }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ color: 'rgba(255,215,0,0.14)', fontFamily: 'serif', fontSize: 30 }}>♠</span>
          </div>
        </div>

        {/* Места */}
        {seats.map((id, i) => {
          const p = pmap[id]
          const out = elim.has(id)
          const ang = (i / n) * Math.PI * 2 - Math.PI / 2
          const x = 50 + 42 * Math.cos(ang)
          const y = 50 + 40 * Math.sin(ang)
          return (
            <motion.div key={id} className="absolute flex flex-col items-center"
              initial={false}
              animate={{ left: `${x}%`, top: `${y}%`, opacity: out ? 0.3 : 1, filter: out ? 'grayscale(1)' : 'grayscale(0)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              style={{ x: '-50%', y: '-50%', width: 64 }}>
              <div className="relative">
                <Avatar player={p} size={36} glow={out ? 'purple' : id === dealerId ? 'gold' : 'teal'} />
                {id === dealerId && !out && (
                  <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full font-mono font-bold"
                    style={{ width: 16, height: 16, fontSize: 9, background: '#ffd700', color: '#1a1208', boxShadow: '0 0 8px rgba(255,215,0,0.7)' }}>
                    D
                  </span>
                )}
                {out && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: 'rgba(255,45,120,0.9)' }}>✕</span>
                )}
              </div>
              <span className="mt-1 text-[9px] font-sans truncate max-w-full"
                style={{ color: out ? 'rgba(240,230,255,0.3)' : 'rgba(240,230,255,0.65)' }}>
                {p?.name}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
