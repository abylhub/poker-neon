import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { addPlayer, updatePlayer, deletePlayer } from '../../lib/db.js'
import { usePlayers } from '../../hooks/useData.js'
import { useToast } from '../../components/Toast.jsx'
import Avatar from '../../components/Avatar.jsx'

function resizePhoto(file, maxPx = 400) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale; canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function AdminPlayers() {
  const toast = useToast()
  const { players } = usePlayers()
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPhoto, setEditPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const addPhotoRef = useRef()

  async function onAddPhoto(e) {
    const file = e.target.files[0]
    if (file) setPhoto(await resizePhoto(file))
  }

  async function onEditPhoto(e) {
    const file = e.target.files[0]
    if (file) setEditPhoto(await resizePhoto(file))
  }

  async function add(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await addPlayer(name.trim(), photo)
    setName(''); setPhoto(null)
    if (addPhotoRef.current) addPhotoRef.current.value = ''
    setSaving(false)
    toast(`${name.trim()} добавлен`)
  }

  function startEdit(p) { setEditId(p.id); setEditName(p.name); setEditPhoto(null) }

  async function save(p) {
    const upd = {}
    if (editName.trim() && editName.trim() !== p.name) upd.name = editName.trim()
    if (editPhoto) upd.photoBase64 = editPhoto
    if (Object.keys(upd).length) {
      setSaving(true)
      await updatePlayer(p.id, upd)
      setSaving(false)
      toast('Сохранено')
    }
    setEditId(null); setEditPhoto(null)
  }

  async function del(id, name) {
    if (confirm(`Удалить ${name}?`)) {
      await deletePlayer(id)
      toast(`${name} удалён`, 'error')
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: '#050510' }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="font-display text-neon-cyan text-base tracking-widest">Игроки</div>
          <Link to="/admin/dashboard" className="text-white/30 hover:text-white/60 text-xs">← Назад</Link>
        </div>

        <div className="card p-4 mb-5">
          <div className="label mb-3">Добавить игрока</div>
          <form onSubmit={add} className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя игрока"
              className="w-full bg-dark-800 border border-neon-cyan/20 rounded px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-neon-cyan/40" />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer btn btn-cyan flex items-center gap-2" style={{ padding: '7px 14px', fontSize: '10px' }}>
                📷 Фото
                <input ref={addPhotoRef} type="file" accept="image/*" onChange={onAddPhoto} className="hidden" />
              </label>
              {photo ? <img src={photo} className="w-10 h-10 rounded-full object-cover border-2 border-neon-cyan/40" /> : <span className="text-xs text-white/20">не выбрано</span>}
              <button type="submit" disabled={!name.trim() || saving} className="btn btn-solid ml-auto">{saving ? '...' : 'Добавить'}</button>
            </div>
          </form>
        </div>

        <div className="space-y-2">
          {players.map(p => (
            <div key={p.id} className="card p-3">
              {editId === p.id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar player={{ ...p, photoBase64: editPhoto || p.photoBase64 }} size={52} />
                      <label className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-lg">📷</span>
                        <input type="file" accept="image/*" onChange={onEditPhoto} className="hidden" />
                      </label>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input value={editName} onChange={e => setEditName(e.target.value)} autoFocus
                        className="w-full bg-dark-800 border border-neon-cyan/30 rounded px-2 py-1.5 text-sm text-white outline-none" />
                      {editPhoto && <div className="text-[10px] neon-green">✓ новое фото выбрано</div>}
                      <div className="text-[10px] text-white/25">Нажми на аватар чтобы сменить фото</div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditId(null)} className="text-white/30 hover:text-white/60 text-xs px-3 py-1.5">Отмена</button>
                    <button onClick={() => save(p)} disabled={saving} className="btn btn-cyan" style={{ padding: '6px 14px', fontSize: '10px' }}>{saving ? '...' : 'Сохранить'}</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar player={p} size={40} />
                  <span className="flex-1 text-sm text-white/80">{p.name}</span>
                  <button onClick={() => startEdit(p)} className="text-white/30 hover:text-neon-cyan text-xs px-2 transition-colors">Ред.</button>
                  <button onClick={() => del(p.id, p.name)} className="text-red-500/30 hover:text-red-500 text-xs px-2 transition-colors">✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
