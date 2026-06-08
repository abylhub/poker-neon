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
                <img src={`${BASE}poker.png`} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
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
                <img src={`${BASE}winner.png`} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
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
            <button type="submit" className="btn btn-teal" style={{ padding: '6px 16px', opacity: annSaved ? 0.6 : 1 }}>
              {annSaved ? '✓ Опубликовано' : 'Опубликовать'}
            </button>
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
