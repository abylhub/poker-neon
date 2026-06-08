import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame, usePlayers } from '../../hooks/useData.js'
import Avatar from '../../components/Avatar.jsx'
import ResultCard from '../../components/ResultCard.jsx'

const PC = { 1: '#00f5ff', 2: '#c0c0ff', 3: '#cd7f32' }

export default function LiveResults() {
  const { gameId } = useParams()
  const { game, loading } = useGame(gameId)
  const { players } = usePlayers()
  const cardRef = useRef(null)
  const [sharing, setSharing] = useState(false)

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" /></div>
  if (!game) return <div className="text-center py-20"><Link to="/" className="btn btn-cyan">На главную</Link></div>

  const pmap = Object.fromEntries(players.map(p => [p.id, p]))
  const results = [...(game.eliminated || [])].sort((a, b) => a.place - b.place)
  const winner = results[0]
  const wp = winner ? pmap[winner.playerId] : null

  async function handleShareCard() {
    if (!cardRef.current || sharing) return
    setSharing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      })
      canvas.toBlob(async blob => {
        const file = new File([blob], 'poker-result.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Poker League — итоги игры' })
        } else {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'poker-result.png'
          a.click()
        }
        setSharing(false)
      }, 'image/png')
    } catch {
      setSharing(false)
    }
  }

  function handleWhatsApp() {
    const date = game?.date
      ? new Date(game.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
      : ''
    let text = `🃏 *Poker League — итоги игры* (${date})\n\n`
    if (wp) text += `👑 Победитель: *${wp.name}* — ${winner.totalPoints} pts\n\n`
    text += `📊 Результаты:\n`
    results.forEach(r => {
      const p = pmap[r.playerId]
      const medal = ['🥇', '🥈', '🥉'][r.place - 1] || `${r.place}.`
      const ko = r.knockouts > 0 ? ` (+${r.knockouts}KO)` : ''
      text += `${medal} ${p?.name || '—'} — ${r.totalPoints}pts${ko}\n`
    })
    text += `\n♠ poker-neon`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Скрытая карточка для скриншота */}
      <ResultCard ref={cardRef} game={game} results={results} pmap={pmap} />

      {wp && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
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
                  <td className="px-3 py-2.5"><span className="font-mono font-bold text-base" style={{ color }}>{r.place <= 3 ? ['🥇', '🥈', '🥉'][r.place - 1] : r.place}</span></td>
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

      {/* Share buttons */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-2 mb-3">
        <button
          onClick={handleShareCard}
          disabled={sharing}
          className="flex-1 flex items-center justify-center gap-2 font-body font-500 text-sm py-2.5 rounded-lg transition-all"
          style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', color: sharing ? 'rgba(255,215,0,0.4)' : 'rgba(255,215,0,0.8)' }}
        >
          {sharing ? '⏳ Создаём...' : '📸 Карточка результата'}
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 font-body font-500 text-sm px-4 py-2.5 rounded-lg transition-all"
          style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', color: 'rgba(37,211,102,0.8)', whiteSpace: 'nowrap' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-3">
        <Link to="/" className="btn btn-cyan flex-1">На главную</Link>
        <Link to="/live/setup" className="btn btn-pink flex-1">Новая игра</Link>
      </motion.div>
    </div>
  )
}
