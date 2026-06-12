import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame, usePlayers } from '../../hooks/useData.js'
import { eliminatePlayer } from '../../lib/db.js'
import Avatar from '../../components/Avatar.jsx'
import BlindTimer from '../../components/BlindTimer.jsx'
import SeatingTable from '../../components/SeatingTable.jsx'

// Полноэкранная вспышка при выбывании — показывается на всех устройствах,
// т.к. триггерится ростом списка eliminated из Firestore
function KnockoutFx({ entry, pmap, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [])
  const p = pmap[entry.playerId]
  const k = entry.eliminatedBy ? pmap[entry.eliminatedBy] : null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onDone}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(circle at 50% 45%, rgba(80,5,30,0.88), rgba(5,5,16,0.96))', backdropFilter: 'blur(10px)' }}>
      <motion.div
        initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 16 }}
        className="flex flex-col items-center">
        <div className="relative mb-4">
          <motion.div animate={{ filter: ['grayscale(0)', 'grayscale(1)'] }} transition={{ delay: 0.5, duration: 0.6 }}>
            <Avatar player={p} size={110} glow="pink" />
          </motion.div>
          <motion.span
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center font-display"
            style={{ fontSize: 64, color: '#ff2d78', textShadow: '0 0 24px rgba(255,45,120,0.9)' }}>
            ✕
          </motion.span>
        </div>
        <motion.div
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
          className="font-display text-3xl tracking-[0.25em] uppercase neon-pink mb-2">
          Выбит
        </motion.div>
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-sm font-sans" style={{ color: 'rgba(240,230,255,0.75)' }}>
          {p?.name} · {entry.place} место · <span className="font-mono" style={{ color: '#00cfff' }}>{entry.totalPoints} pts</span>
        </motion.div>
        {k && (
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}
            className="flex items-center gap-2 mt-3">
            <Avatar player={k} size={26} glow="green" />
            <span className="text-xs font-sans" style={{ color: '#00ff9f' }}>нокаут: {k.name}</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

function Modal({ players, onConfirm, onClose }) {
  const [victim, setVictim] = useState('')
  const [killer, setKiller] = useState('none')
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,16,0.92)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-sm card-pink p-5" style={{ boxShadow: '0 0 40px rgba(255,0,255,0.15)' }}>
        <div className="label mb-4">Выбить игрока</div>
        <div className="mb-4">
          <div className="text-xs text-white/40 mb-2">Кто выбывает?</div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {players.map(p => (
              <button key={p.id} onClick={() => setVictim(p.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded border text-left transition-all"
                style={victim === p.id ? { borderColor: 'rgba(255,0,255,0.5)', background: 'rgba(255,0,255,0.1)' } : { borderColor: 'rgba(255,255,255,0.06)' }}>
                <Avatar player={p} size={28} glow="pink" />
                <span className="text-sm text-white/80">{p.name}</span>
                {victim === p.id && <span className="ml-auto text-neon-pink text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <div className="text-xs text-white/40 mb-2">Кто его выбил? <span className="text-white/25">(необязательно)</span></div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            <button onClick={() => setKiller('none')} className="w-full flex items-center gap-2 p-2 rounded border text-left transition-all"
              style={killer === 'none' ? { borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)' } : { borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="text-sm text-white/40 italic">— Никто</span>
            </button>
            {players.filter(p => p.id !== victim).map(p => (
              <button key={p.id} onClick={() => setKiller(p.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded border text-left transition-all"
                style={killer === p.id ? { borderColor: 'rgba(127,255,0,0.4)', background: 'rgba(127,255,0,0.07)' } : { borderColor: 'rgba(255,255,255,0.06)' }}>
                <Avatar player={p} size={28} glow="green" />
                <span className="text-sm text-white/80">{p.name}</span>
                {killer === p.id && <span className="ml-auto neon-green text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-cyan flex-1" style={{ opacity: 0.5 }}>Отмена</button>
          <button onClick={() => { if (victim) onConfirm(victim, killer === 'none' ? null : killer) }} disabled={!victim} className="btn btn-pink flex-1">Выбить</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LiveGame() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [acting, setActing] = useState(false)
  const [fx, setFx] = useState(null)
  const prevElimCount = useRef(null)
  const { game, loading } = useGame(gameId)
  const { players } = usePlayers()

  // Новая запись в eliminated (с любого устройства) → показать анимацию выбывания
  useEffect(() => {
    if (!game) return
    const list = game.eliminated || []
    if (prevElimCount.current !== null && list.length > prevElimCount.current) {
      const fresh = list.slice(prevElimCount.current).filter(e => e.place > 1)
      if (fresh.length) setFx(fresh[fresh.length - 1])
    }
    prevElimCount.current = list.length
  }, [game?.eliminated?.length])

  // Переход к итогам — после того, как доиграет анимация последнего выбывания
  useEffect(() => {
    if (game?.status === 'completed' && !fx) {
      navigate(`/live/${gameId}/results`, { replace: true })
    }
  }, [game?.status, fx])

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" /></div>
  if (!game) return <div className="text-center py-20"><div className="text-white/30 mb-4">Игра не найдена</div><button onClick={() => navigate('/')} className="btn btn-cyan">На главную</button></div>

  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const elim = new Set((game.eliminated || []).map(e => e.playerId))
  const active = (game.playerIds || []).filter(id => !elim.has(id)).map(id => pmap[id]).filter(Boolean)
  const done = [...(game.eliminated || [])].reverse()

  async function onElim(victimId, killerId) {
    setActing(true)
    setModal(false)
    await eliminatePlayer(gameId, victimId, killerId)
    setActing(false)
  }

  return (
    <>
      <AnimatePresence>{modal && <Modal players={active} onConfirm={onElim} onClose={() => setModal(false)} />}</AnimatePresence>
      <AnimatePresence>{fx && <KnockoutFx entry={fx} pmap={pmap} onDone={() => setFx(null)} />}</AnimatePresence>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="live-dot" />
              <span className="font-display text-red-400 text-[9px] tracking-widest">LIVE</span>
              <span className={game.type === 'special' ? 'badge-special' : 'badge-season'}>{game.type === 'special' ? 'Special' : 'Season'}</span>
            </div>
            <h1 className="font-display text-lg text-white">{game.title || 'Покерная игра'}</h1>
          </div>
          <div className="text-right">
            <motion.div key={active.length} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="font-mono text-3xl font-bold neon-cyan">{active.length}</motion.div>
            <div className="label" style={{ fontSize: '9px' }}>осталось</div>
          </div>
        </div>

        {game.blindTimer && <BlindTimer gameId={gameId} timer={game.blindTimer} />}

        <SeatingTable game={game} players={players} />

        <div className="card p-4 mb-4">
          <div className="label mb-3">В игре</div>
          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence>
              {active.map(p => {
                const kos = game.knockouts?.[p.id] || 0
                return (
                  <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 60, scale: 0.7 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex items-center gap-2 p-2.5 rounded border border-neon-cyan/10 bg-neon-cyan/[0.02]">
                    <Avatar player={p} size={32} />
                    <div className="min-w-0">
                      <div className="text-sm text-white/75 truncate">{p.name}</div>
                      {kos > 0 && <div className="text-[10px] neon-green">+{kos} KO</div>}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        <button onClick={() => setModal(true)} disabled={active.length <= 1 || acting} className="btn w-full mb-4 py-4"
          style={{ border: '1px solid rgba(255,0,255,0.4)', color: '#ff00ff', background: 'rgba(255,0,255,0.07)', fontFamily: 'Orbitron', fontSize: '11px', letterSpacing: '0.15em' }}>
          {acting ? 'Сохраняем...' : 'Выбить игрока'}
        </button>

        {done.length > 0 && (
          <div className="card p-4">
            <div className="label mb-3">Выбыли</div>
            <AnimatePresence initial={false}>
              {done.map(e => {
                const p = pmap[e.playerId]
                const k = e.eliminatedBy ? pmap[e.eliminatedBy] : null
                return (
                  <motion.div key={e.playerId} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="font-mono text-xs text-white/25 w-5 text-center flex-shrink-0">{e.place}</span>
                    <Avatar player={p} size={28} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white/60">{p?.name}</span>
                      {k && <span className="text-[10px] neon-green ml-1.5">← {k.name}</span>}
                    </div>
                    <span className="font-mono font-bold text-sm neon-cyan">{e.totalPoints}</span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  )
}
