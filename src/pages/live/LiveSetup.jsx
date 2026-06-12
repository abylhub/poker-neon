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
  const [blindMinutes, setBlindMinutes] = useState(30)
  const [loading, setLoading] = useState(false)

  const toggle = id => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const canStart = sel.length >= 2 && (type === 'special' ? title.trim() : !!season)

  async function start() {
    if (!canStart || loading) return
    setLoading(true)
    const game = await createLiveGame({ type, seasonId: season?.id, title, description: desc, playerIds: sel, blindMinutes })
    navigate(`/live/${game.id}`)
  }

  if (liveGame) return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="live-dot" />
        <span className="font-display text-[#ff2d78] text-xs tracking-wider font-400">Игра идёт</span>
      </div>
      <div className="font-display text-xl font-400 mb-6" style={{ color: '#f0e6ff' }}>{liveGame.title || 'Активная игра'}</div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate(`/live/${liveGame.id}`)} className="btn btn-teal">Продолжить</button>
        <button onClick={() => navigate(`/live/${liveGame.id}/results`)} className="btn btn-pink">Итоги</button>
      </div>
    </div>
  )

  const inputCls = "w-full rounded px-3 py-2 text-sm font-body outline-none transition-colors"
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,45,120,0.2)', color: '#f0e6ff' }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="label mb-1">Live Game</div>
        <h1 className="font-display text-xl font-400" style={{ color: '#f0e6ff' }}>Новая игра</h1>
      </div>

      {/* Тип */}
      <div className="card p-4 mb-4">
        <div className="label mb-3">Тип игры</div>
        <div className="flex gap-3">
          {[['season', 'SEASON', '#00d4ff'], ['special', 'SPECIAL', '#ff6b35']].map(([v, label, color]) => (
            <button key={v} onClick={() => setType(v)}
              className="flex-1 py-3 rounded font-display text-xs tracking-wider font-400 transition-all"
              style={type === v
                ? { border: `1px solid ${color}`, background: `${color}15`, color }
                : { border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,230,255,0.3)' }}>
              {label}
            </button>
          ))}
        </div>
        {type === 'season' && !season && <p className="mt-3 text-xs font-body" style={{ color: 'rgba(255,100,100,0.8)' }}>Нет активного сезона — создайте в Admin.</p>}
        {type === 'season' && season && <p className="mt-3 text-[11px] font-mono" style={{ color: 'rgba(0,212,255,0.5)' }}>{season.name}</p>}
      </div>

      {type === 'special' && (
        <div className="card-purple p-4 mb-4">
          <div className="label mb-3">Название турнира</div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Новогодний турнир..."
            className={inputCls} style={{ ...inputStyle, marginBottom: 8 }} />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Дополнительные правила..." rows={2}
            className={inputCls + ' resize-none'} style={inputStyle} />
        </div>
      )}

      {/* Таймер блайндов */}
      <div className="card p-4 mb-4">
        <div className="label mb-3">Таймер блайндов · минут на уровень</div>
        <div className="flex gap-2">
          {[[null, 'Выкл'], [20, '20'], [25, '25'], [30, '30']].map(([v, label]) => (
            <button key={label} onClick={() => setBlindMinutes(v)}
              className="flex-1 py-2.5 rounded font-mono text-sm transition-all"
              style={blindMinutes === v
                ? { border: '1px solid rgba(255,215,0,0.5)', background: 'rgba(255,215,0,0.08)', color: '#ffd700' }
                : { border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,230,255,0.35)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Участники */}
      <div className="card p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="label">Участники</div>
          <span className="font-mono text-xs" style={{ color: 'rgba(255,45,120,0.6)' }}>{sel.length} выбрано</span>
        </div>
        {players.length === 0
          ? <p className="text-sm font-body text-center py-4" style={{ color: 'rgba(240,230,255,0.3)' }}>Нет игроков</p>
          : (
            <div className="grid grid-cols-2 gap-2">
              {players.map(p => {
                const on = sel.includes(p.id)
                return (
                  <button key={p.id} onClick={() => toggle(p.id)}
                    className="flex items-center gap-2 p-2.5 rounded text-left transition-all"
                    style={on
                      ? { border: '1px solid rgba(255,45,120,0.45)', background: 'rgba(255,45,120,0.08)' }
                      : { border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Avatar player={p} size={32} glow={on ? 'pink' : 'teal'} />
                    <span className="text-sm font-body font-500 truncate" style={{ color: on ? '#f0e6ff' : 'rgba(240,230,255,0.45)' }}>{p.name}</span>
                    {on && <span className="ml-auto text-xs vc-pink">✓</span>}
                  </button>
                )
              })}
            </div>
          )}
      </div>

      <button onClick={start} disabled={!canStart || loading}
        className="btn w-full py-4 font-display font-400"
        style={canStart
          ? { border: '1px solid #ff2d78', color: '#ff2d78', background: 'rgba(255,45,120,0.08)', letterSpacing: '0.2em', fontSize: '11px' }
          : { border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,230,255,0.2)', letterSpacing: '0.2em', fontSize: '11px', cursor: 'not-allowed' }}>
        {loading ? 'Создаём...' : `СТАРТ — ${sel.length} игроков`}
      </button>
    </div>
  )
}
