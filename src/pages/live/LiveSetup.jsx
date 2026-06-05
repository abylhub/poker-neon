import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayers, useActiveSeason, useLiveGame } from '../../hooks/useData.js'
import { createLiveGame } from '../../lib/db.js'
import Avatar from '../../components/Avatar.jsx'

export default function LiveSetup() {
  const navigate = useNavigate()
  const { players } = usePlayers()
  const { season } = useActiveSeason()
  const liveGame = useLiveGame()
  const [type, setType] = useState('season')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [sel, setSel] = useState([])
  const [loading, setLoading] = useState(false)

  const toggle = (id) => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const canStart = sel.length >= 2 && (type === 'special' ? title.trim() : !!season)

  async function start() {
    if (!canStart || loading) return
    setLoading(true)
    const game = await createLiveGame({ type, seasonId: season?.id, title, description: desc, playerIds: sel })
    navigate(`/live/${game.id}`)
  }

  if (liveGame) return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="flex items-center justify-center gap-2 mb-4"><span className="live-dot" /><span className="font-display text-red-400 text-xs tracking-wider">Игра идёт</span></div>
      <div className="font-display text-xl text-white mb-6">{liveGame.title || 'Активная игра'}</div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate(`/live/${liveGame.id}`)} className="btn btn-cyan">Продолжить</button>
        <button onClick={() => navigate(`/live/${liveGame.id}/results`)} className="btn btn-pink">Итоги</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6"><div className="label mb-1">Live Game</div><h1 className="font-display text-xl text-white">Новая игра</h1></div>

      <div className="card p-4 mb-4">
        <div className="label mb-3">Тип игры</div>
        <div className="flex gap-3">
          {[['season', 'SEASON', '#00f5ff'], ['special', 'SPECIAL', '#ff6b00']].map(([v, label, color]) => (
            <button key={v} onClick={() => setType(v)} className="flex-1 py-3 rounded border font-display text-xs tracking-wider transition-all"
              style={type === v ? { borderColor: color, background: `${color}18`, color } : { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(224,224,255,0.3)' }}>
              {label}
            </button>
          ))}
        </div>
        {type === 'season' && !season && <p className="mt-3 text-xs text-red-400/80">Нет активного сезона — создайте в Admin.</p>}
        {type === 'season' && season && <p className="mt-3 text-[11px] text-neon-cyan/50 font-mono">{season.name}</p>}
      </div>

      {type === 'special' && (
        <div className="card-orange p-4 mb-4">
          <div className="label mb-3">Название турнира</div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Новогодний турнир..."
            className="w-full bg-dark-800 border border-neon-orange/25 rounded px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-neon-orange/50 mb-2" />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Дополнительные правила..." rows={2}
            className="w-full bg-dark-800 border border-neon-orange/25 rounded px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-neon-orange/50 resize-none" />
        </div>
      )}

      <div className="card p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="label">Участники</div>
          <span className="font-mono text-xs text-neon-cyan/50">{sel.length} выбрано</span>
        </div>
        {players.length === 0
          ? <p className="text-sm text-white/30 text-center py-4">Нет игроков</p>
          : (
            <div className="grid grid-cols-2 gap-2">
              {players.map(p => {
                const on = sel.includes(p.id)
                return (
                  <button key={p.id} onClick={() => toggle(p.id)} className="flex items-center gap-2 p-2.5 rounded border text-left transition-all"
                    style={on ? { borderColor: 'rgba(0,245,255,0.4)', background: 'rgba(0,245,255,0.07)' } : { borderColor: 'rgba(255,255,255,0.06)' }}>
                    <Avatar player={p} size={32} />
                    <span className={`text-sm font-medium truncate ${on ? 'text-white' : 'text-white/45'}`}>{p.name}</span>
                    {on && <span className="ml-auto text-neon-cyan text-xs">✓</span>}
                  </button>
                )
              })}
            </div>
          )}
      </div>

      <button onClick={start} disabled={!canStart || loading} className="btn w-full py-4"
        style={canStart ? { border: '1px solid #00f5ff', color: '#00f5ff', background: 'rgba(0,245,255,0.08)', fontFamily: 'Orbitron', fontSize: '12px', letterSpacing: '0.15em' }
          : { border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)', fontFamily: 'Orbitron', fontSize: '12px', letterSpacing: '0.15em', cursor: 'not-allowed' }}>
        {loading ? 'Создаём...' : `СТАРТ — ${sel.length} игроков`}
      </button>
    </div>
  )
}
