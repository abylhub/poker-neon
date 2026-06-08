import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogout, addSeason, closeSeason } from '../../lib/db.js'
import { usePlayers, useGames, useActiveSeason } from '../../hooks/useData.js'
import { getAnnouncement, saveAnnouncement, clearAnnouncement, getChampions, saveChampions } from '../../data/store.js'

const BASE = import.meta.env.BASE_URL

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { players } = usePlayers()
  const { games } = useGames()
  const { season } = useActiveSeason()

  function logout() { adminLogout(); navigate('/admin') }
  async function newSeason() { const n = prompt('Название сезона:', `Сезон ${new Date().getFullYear()}`); if (n) await addSeason(n) }
  async function endSeason() { if (season && confirm(`Закрыть "${season.name}"?`)) await closeSeason(season.id) }

  // Champions
  const stored = getChampions()
  const [seasonChampId, setSeasonChampId]   = useState(stored.seasonChampionId || '')
  const [lastWinnerId,  setLastWinnerId]     = useState(stored.lastGameWinnerId || '')
  const [champSaved, setChampSaved] = useState(false)

  function handleSaveChampions(e) {
    e.preventDefault()
    saveChampions({ seasonChampionId: seasonChampId || null, lastGameWinnerId: lastWinnerId || null })
    setChampSaved(true)
    setTimeout(() => setChampSaved(false), 2000)
  }

  // Announcement
  const existingAnn = getAnnouncement()
  const [annTitle, setAnnTitle] = useState(existingAnn?.title || '')
  const [annDate, setAnnDate]   = useState(existingAnn?.gameDate ? new Date(existingAnn.gameDate).toISOString().slice(0, 16) : '')
  const [annDesc, setAnnDesc]   = useState(existingAnn?.description || '')
  const [annSaved, setAnnSaved] = useState(false)
  const [, rerender] = useState(0)

  function handleSaveAnnouncement(e) {
    e.preventDefault()
    if (!annTitle.trim()) return
    saveAnnouncement({
      title: annTitle.trim(),
      gameDate: annDate ? new Date(annDate).getTime() : null,
      description: annDesc.trim() || null,
    })
    setAnnSaved(true)
    rerender(n => n + 1)
    setTimeout(() => setAnnSaved(false), 2000)
  }

  function handleClearAnnouncement() {
    clearAnnouncement()
    setAnnTitle(''); setAnnDate(''); setAnnDesc('')
    rerender(n => n + 1)
  }

  const currentAnn = getAnnouncement()

  const selectStyle = {
    width: '100%', fontFamily: 'inherit', fontSize: '0.875rem',
    padding: '8px 12px', borderRadius: '6px', outline: 'none',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(240,230,255,0.8)',
    appearance: 'none',
  }

  return (
    <div className="min-h-screen p-4" style={{ background: '#0d0818' }}>
      <div className="max-w-lg mx-auto">
        <div className="vc-line mb-6" />
        <div className="flex items-center justify-between mb-6">
          <div className="font-display text-lg font-400 tracking-widest" style={{ color: '#ff2d78', textShadow: '0 0 15px rgba(255,45,120,0.5)' }}>ADMIN</div>
          <button onClick={logout} className="font-body text-xs transition-colors" style={{ color: 'rgba(240,230,255,0.3)' }}>Выйти</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { val: players.length, label: 'Игроков', color: '#ff2d78' },
            { val: games.filter(g => g.status === 'completed').length, label: 'Игр', color: '#00d4ff' },
          ].map(({ val, label, color }) => (
            <div key={label} className="card p-4 text-center" style={{ borderColor: `${color}25` }}>
              <div className="font-mono font-500 text-2xl mb-1" style={{ color, textShadow: `0 0 10px ${color}55` }}>{val}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>

        {/* Season */}
        <div className="card p-4 mb-4">
          <div className="label mb-3">Текущий сезон</div>
          {season
            ? <div className="flex items-center justify-between">
                <span className="font-body font-500 text-sm" style={{ color: 'rgba(240,230,255,0.7)' }}>{season.name}</span>
                <button onClick={endSeason} className="btn btn-pink" style={{ padding: '6px 12px' }}>Закрыть</button>
              </div>
            : <div className="flex items-center justify-between">
                <span className="font-body text-sm" style={{ color: 'rgba(240,230,255,0.3)' }}>Нет активного сезона</span>
                <button onClick={newSeason} className="btn btn-teal" style={{ padding: '6px 12px' }}>Создать</button>
              </div>
          }
        </div>

        {/* Champions */}
        <div className="card p-4 mb-4">
          <div className="label mb-3">Чемпионы</div>
          <form onSubmit={handleSaveChampions} className="space-y-3">
            <div>
              <label className="flex items-center gap-2 font-body text-xs mb-1.5" style={{ color: 'rgba(240,230,255,0.4)' }}>
                <img src={`${BASE}poker1.png`} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                Чемпион сезона
              </label>
              <select value={seasonChampId} onChange={e => setSeasonChampId(e.target.value)} style={selectStyle}>
                <option value="">— не выбран —</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 font-body text-xs mb-1.5" style={{ color: 'rgba(240,230,255,0.4)' }}>
                <img src={`${BASE}winner1.png`} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                Победитель последней игры
              </label>
              <select value={lastWinnerId} onChange={e => setLastWinnerId(e.target.value)} style={selectStyle}>
                <option value="">— не выбран —</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-gold" style={{ padding: '6px 16px', opacity: champSaved ? 0.6 : 1 }}>
              {champSaved ? '✓ Сохранено' : 'Сохранить'}
            </button>
          </form>
        </div>

        {/* Announcement */}
        <div className="card p-4 mb-4">
          <div className="label mb-3">Анонс игры</div>

          {currentAnn && (
            <div className="mb-4 p-3 rounded" style={{ border: '1px solid rgba(0,212,255,0.25)', background: 'rgba(0,212,255,0.04)' }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-body font-500 text-sm" style={{ color: 'rgba(240,230,255,0.8)' }}>{currentAnn.title}</div>
                  {currentAnn.gameDate && (
                    <div className="font-mono text-xs mt-0.5" style={{ color: 'rgba(0,212,255,0.6)' }}>
                      {new Date(currentAnn.gameDate).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                <button onClick={handleClearAnnouncement} className="font-body text-xs flex-shrink-0" style={{ color: 'rgba(255,45,120,0.6)' }}>Удалить</button>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveAnnouncement} className="space-y-3">
            <div>
              <label className="block font-body text-xs mb-1" style={{ color: 'rgba(240,230,255,0.4)' }}>Заголовок *</label>
              <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Следующая игра"
                className="w-full font-body text-sm px-3 py-2 rounded outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,230,255,0.8)' }} />
            </div>
            <div>
              <label className="block font-body text-xs mb-1" style={{ color: 'rgba(240,230,255,0.4)' }}>Дата и время</label>
              <input type="datetime-local" value={annDate} onChange={e => setAnnDate(e.target.value)}
                className="w-full font-body text-sm px-3 py-2 rounded outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,230,255,0.8)' }} />
            </div>
            <div>
              <label className="block font-body text-xs mb-1" style={{ color: 'rgba(240,230,255,0.4)' }}>Описание</label>
              <input value={annDesc} onChange={e => setAnnDesc(e.target.value)} placeholder="Адрес, детали..."
                className="w-full font-body text-sm px-3 py-2 rounded outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,230,255,0.8)' }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button type="submit" className="btn btn-teal" style={{ padding: '6px 16px', opacity: annSaved ? 0.6 : 1 }}>
                {annSaved ? '✓ Опубликовано' : 'Опубликовать'}
              </button>
              {currentAnn && (
                <button type="button" onClick={() => {
                  const ann = currentAnn
                  const dateStr = ann.gameDate
                    ? new Date(ann.gameDate).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
                    : ''
                  let text = `🃏 *${ann.title}*`
                  if (dateStr) text += `\n📅 ${dateStr}`
                  if (ann.description) text += `\n📍 ${ann.description}`
                  text += `\n\n♠ Poker League\nhttps://abylhub.github.io/poker-neon/`
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                }}
                  className="flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', color: 'rgba(37,211,102,0.8)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Nav links */}
        <div className="space-y-2">
          {[
            { to: '/admin/players', label: 'Управление игроками' },
            { to: '/live/setup',    label: 'Начать новую игру' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}
              className="flex items-center justify-between card p-4 transition-all font-body font-500 text-sm"
              style={{ color: 'rgba(240,230,255,0.6)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,45,120,0.15)'}>
              {label} <span style={{ color: '#ff2d78' }}>→</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="font-body text-xs" style={{ color: 'rgba(240,230,255,0.2)' }}>← На сайт</Link>
        </div>
      </div>
    </div>
  )
}
