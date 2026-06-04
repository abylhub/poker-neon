import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getPlayers, addPlayer, updatePlayer, deletePlayer } from '../../data/store.js'
import Avatar from '../../components/Avatar.jsx'

function resizePhoto(file, maxPx = 300) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function AdminPlayers() {
  const [players, setPlayers] = useState(getPlayers)
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPhoto, setEditPhoto] = useState(null)
  const addPhotoRef = useRef()

  const reload = () => setPlayers(getPlayers())

  async function onAddPhoto(e) {
    const file = e.target.files[0]
    if (file) setPhoto(await resizePhoto(file))
  }

  async function onEditPhoto(e) {
    const file = e.target.files[0]
    if (file) setEditPhoto(await resizePhoto(file))
  }

  function add(e) {
    e.preventDefault()
    if (!name.trim()) return
    addPlayer(name.trim(), photo)
    setName(''); setPhoto(null)
    if (addPhotoRef.current) addPhotoRef.current.value = ''
    reload()
  }

  function startEdit(p) {
    setEditId(p.id)
    setEditName(p.name)
    setEditPhoto(null)
  }

  function save(p) {
    const upd = {}
    if (editName.trim()) upd.name = editName.trim()
    if (editPhoto) upd.photoBase64 = editPhoto
    if (Object.keys(upd).length) updatePlayer(p.id, upd)
    setEditId(null)
    setEditPhoto(null)
    reload()
  }

  function del(id) {
    if (confirm('Удалить игрока?')) { deletePlayer(id); reload() }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: '#050510' }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="font-display text-neon-cyan text-base tracking-widest">Игроки</div>
          <Link to="/admin/dashboard" className="text-white/30 hover:text-white/60 text-xs">← Назад</Link>
        </div>

        {/* Добавить */}
        <div className="card p-4 mb-5">
          <div className="label mb-3">Добавить игрока</div>
          <form onSubmit={add} className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя игрока"
              className="w-full bg-dark-800 border border-neon-cyan/20 rounded px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-neon-cyan/40" />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer btn btn-cyan" style={{ padding: '7px 14px', fontSize: '10px' }}>
                📷 Фото
                <input ref={addPhotoRef} type="file" accept="image/*" onChange={onAddPhoto} className="hidden" />
              </label>
              {photo
                ? <img src={photo} className="w-10 h-10 rounded-full object-cover border border-neon-cyan/40" />
                : <span className="text-xs text-white/20">не выбрано</span>}
              <button type="submit" disabled={!name.trim()} className="btn btn-solid ml-auto">Добавить</button>
            </div>
          </form>
        </div>

        {/* Список */}
        <div className="space-y-2">
          {players.map(p => (
            <div key={p.id} className="card p-3">
              {editId === p.id ? (
                // Режим редактирования
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar player={{ ...p, photoBase64: editPhoto || p.photoBase64 }} size={48} />
                    <div className="flex-1 space-y-2">
                      <input value={editName} onChange={e => setEditName(e.target.value)} autoFocus
                        className="w-full bg-dark-800 border border-neon-cyan/30 rounded px-2 py-1.5 text-sm text-white outline-none" />
                      <label className="cursor-pointer flex items-center gap-2 text-xs text-neon-cyan/60 hover:text-neon-cyan">
                        📷 Сменить фото
                        <input type="file" accept="image/*" onChange={onEditPhoto} className="hidden" />
                        {editPhoto && <span className="text-neon-green">✓ загружено</span>}
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditId(null)} className="text-white/30 hover:text-white/60 text-xs px-3 py-1.5">Отмена</button>
                    <button onClick={() => save(p)} className="btn btn-cyan" style={{ padding: '6px 14px', fontSize: '10px' }}>Сохранить</button>
                  </div>
                </div>
              ) : (
                // Обычный вид
                <div className="flex items-center gap-3">
                  <Avatar player={p} size={40} />
                  <span className="flex-1 text-sm text-white/80">{p.name}</span>
                  <button onClick={() => startEdit(p)} className="text-white/30 hover:text-white/60 text-xs px-2">Ред.</button>
                  <button onClick={() => del(p.id)} className="text-red-500/40 hover:text-red-500 text-xs px-2">✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
