import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getTimerState, formatMs } from '../data/blinds.js'
import { pauseBlindTimer, resumeBlindTimer, skipBlindLevel } from '../lib/db.js'

// Три восходящих тона через Web Audio — без аудиофайлов
function playLevelUpSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    if (ctx.state === 'suspended') ctx.resume()
    const t0 = ctx.currentTime
    ;[660, 880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      o.connect(g)
      g.connect(ctx.destination)
      const t = t0 + i * 0.18
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17)
      o.start(t)
      o.stop(t + 0.18)
    })
    setTimeout(() => ctx.close(), 1000)
  } catch { /* звук — не критично */ }
}

const GOLD = '#ffd700'
const CYAN = '#00f5ff'

function CtrlBtn({ onClick, children, title }) {
  return (
    <button onClick={onClick} title={title}
      className="px-2.5 py-1.5 rounded text-xs transition-all"
      style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(240,230,255,0.55)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)'; e.currentTarget.style.color = GOLD }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(240,230,255,0.55)' }}>
      {children}
    </button>
  )
}

function Fullscreen({ st, gameId, onClose }) {
  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: 'rgba(5,5,16,0.98)' }}>
      <button onClick={onClose} className="absolute top-5 right-5 text-2xl px-3 py-1"
        style={{ color: 'rgba(240,230,255,0.4)' }}>✕</button>

      <div className="label mb-2" style={{ fontSize: '11px' }}>Уровень {st.levelIndex + 1}</div>

      <div className="font-mono font-bold leading-none mb-4"
        style={{ fontSize: 'min(26vw, 160px)', color: st.paused ? 'rgba(240,230,255,0.3)' : CYAN, textShadow: st.paused ? 'none' : `0 0 40px ${CYAN}40` }}>
        {st.remainingMs == null ? 'MAX' : formatMs(st.remainingMs)}
      </div>

      <div className="font-mono font-bold mb-2"
        style={{ fontSize: 'min(13vw, 72px)', color: GOLD, textShadow: `0 0 30px ${GOLD}40` }}>
        {st.level.sb} / {st.level.bb}
      </div>

      {st.next && (
        <div className="font-mono text-sm mb-8" style={{ color: 'rgba(240,230,255,0.3)' }}>
          далее {st.next.sb} / {st.next.bb}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => st.paused ? resumeBlindTimer(gameId) : pauseBlindTimer(gameId)}
          className="btn btn-cyan px-8 py-3">{st.paused ? '▶ Продолжить' : '⏸ Пауза'}</button>
        {st.next && (
          <button onClick={() => skipBlindLevel(gameId)} className="btn btn-pink px-8 py-3">⏭ Уровень</button>
        )}
      </div>
    </motion.div>,
    document.body
  )
}

export default function BlindTimer({ gameId, timer }) {
  const [now, setNow] = useState(Date.now())
  const [full, setFull] = useState(false)
  const prevLevel = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [])

  const st = getTimerState(timer, now)

  useEffect(() => {
    if (!st) return
    if (prevLevel.current !== null && st.levelIndex > prevLevel.current) playLevelUpSound()
    prevLevel.current = st.levelIndex
  }, [st?.levelIndex])

  if (!st) return null

  return (
    <>
      <AnimatePresence>{full && <Fullscreen st={st} gameId={gameId} onClose={() => setFull(false)} />}</AnimatePresence>
      <div className="card p-4 mb-4" style={{ borderColor: 'rgba(255,215,0,0.18)' }}>
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => setFull(true)} className="text-left min-w-0">
            <div className="label mb-1" style={{ fontSize: '9px' }}>Блайнды · уровень {st.levelIndex + 1}</div>
            <div className="font-mono font-bold text-2xl" style={{ color: GOLD }}>{st.level.sb} / {st.level.bb}</div>
            {st.next && <div className="font-mono text-[10px] mt-0.5" style={{ color: 'rgba(240,230,255,0.3)' }}>далее {st.next.sb}/{st.next.bb}</div>}
          </button>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button onClick={() => setFull(true)} className="font-mono font-bold text-3xl leading-none"
              style={{ color: st.paused ? 'rgba(240,230,255,0.3)' : CYAN }}>
              {st.remainingMs == null ? 'MAX' : formatMs(st.remainingMs)}
            </button>
            <div className="flex gap-1.5">
              <CtrlBtn title={st.paused ? 'Продолжить' : 'Пауза'}
                onClick={() => st.paused ? resumeBlindTimer(gameId) : pauseBlindTimer(gameId)}>
                {st.paused ? '▶' : '⏸'}
              </CtrlBtn>
              {st.next && <CtrlBtn title="Следующий уровень" onClick={() => skipBlindLevel(gameId)}>⏭</CtrlBtn>}
              <CtrlBtn title="На весь экран" onClick={() => setFull(true)}>⛶</CtrlBtn>
            </div>
          </div>
        </div>
        {st.paused && <div className="mt-2 text-[10px] font-mono text-center" style={{ color: 'rgba(255,215,0,0.5)' }}>таймер на паузе</div>}
      </div>
    </>
  )
}
