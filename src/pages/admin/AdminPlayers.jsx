import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlayers, addPlayer, updatePlayer, deletePlayer } from '../../data/store.js'
import Avatar from '../../components/Avatar.jsx'

export default function AdminPlayers() {
  const [players, setPlayers] = useState(getPlayers)
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')

  function reload() { setPlayers(getPlayers()) }

  function onPhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  function add(e) {
    e.preventDefault()
    if (!name.trim()) return
    addPlayer(name.trim(), photo)
    setName(''); setPhoto(null)
    reload()
  }

  function save(id) {
    if (editName.trim()) updatePlayer(id, {name: editName.trim()})
    setEditId(null); reload()
  }

  function del(id) {
    if (confirm('Удалить игрока?')) { deletePlayer(id); reload() }
  }

  return (
    <div className="min-h-screen p-4" style={{background:'#050510'}}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="font-display text-neon-cyan text-base tracking-widest">Игроки</div>
          <Link to="/admin/dashboard" className="text-white/30 hover:text-white/60 text-xs">← Назад</Link>
        </div>

        {/* Добавить */}
        <div className="card p-4 mb-5">
          <div className="label mb-3">Добавить игрока</div>
          <form onSubmit={add} className="space-y-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Имя игрока"
              className="w-full bg-dark-800 border border-neon-cyan/20 rounded px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-neon-cyan/40"/>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer btn btn-cyan" style={{padding:'7px 14px',fontSize:'10px'}}>
                Фото
                <input type="file" accept="image/*" onChange={onPhoto} className="hidden"/>
              </label>
              {photo && <span className="text-xs text-neon-cyan/60">✓ загружено</span>}
              <button type="submit" disabled={!name.trim()} className="btn btn-solid ml-auto">Добавить</button>
            </div>
          </form>
        </div>

        {/* Список */}
        <div className="space-y-2">
          {players.map(p=>(
            <div key={p.id} className="card p-3 flex items-center gap-3">
              <Avatar player={p} size={40}/>
              {editId===p.id ? (
                <input value={editName} onChange={e=>setEditName(e.target.value)} autoFocus
                  className="flex-1 bg-dark-800 border border-neon-cyan/30 rounded px-2 py-1 text-sm text-white outline-none"/>
              ) : (
                <span className="flex-1 text-sm text-white/80">{p.name}</span>
              )}
              <div className="flex gap-2">
                {editId===p.id ? (
                  <button onClick={()=>save(p.id)} className="btn btn-cyan" style={{padding:'5px 10px',fontSize:'10px'}}>✓</button>
                ) : (
                  <button onClick={()=>{setEditId(p.id);setEditName(p.name)}} className="text-white/30 hover:text-white/60 text-xs px-2">Ред.</button>
                )}
                <button onClick={()=>del(p.id)} className="text-red-500/40 hover:text-red-500 text-xs px-2">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
