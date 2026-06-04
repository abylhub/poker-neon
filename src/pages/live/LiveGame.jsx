import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGame, getPlayers, eliminatePlayer } from '../../data/store.js'
import Avatar from '../../components/Avatar.jsx'

function Modal({ players, onConfirm, onClose }) {
  const [victim, setVictim] = useState('')
  const [killer, setKiller] = useState('none')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(5,5,16,0.92)',backdropFilter:'blur(8px)'}}>
      <div className="w-full max-w-sm card-pink p-5" style={{boxShadow:'0 0 40px rgba(255,0,255,0.12)'}}>
        <div className="label mb-4">Выбить игрока</div>

        <div className="mb-4">
          <div className="text-xs text-white/40 mb-2">Кто выбывает?</div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {players.map(p=>(
              <button key={p.id} onClick={()=>setVictim(p.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded border text-left transition-all"
                style={victim===p.id ? {borderColor:'rgba(255,0,255,0.5)',background:'rgba(255,0,255,0.1)'} : {borderColor:'rgba(255,255,255,0.06)'}}>
                <Avatar player={p} size={28} glow="pink"/>
                <span className="text-sm text-white/80">{p.name}</span>
                {victim===p.id && <span className="ml-auto text-neon-pink text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <div className="text-xs text-white/40 mb-2">Кто его выбил? <span className="text-white/25">(необязательно)</span></div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            <button onClick={()=>setKiller('none')} className="w-full flex items-center gap-2 p-2 rounded border text-left transition-all"
              style={killer==='none' ? {borderColor:'rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.04)'} : {borderColor:'rgba(255,255,255,0.06)'}}>
              <span className="text-sm text-white/40 italic">— Никто</span>
            </button>
            {players.filter(p=>p.id!==victim).map(p=>(
              <button key={p.id} onClick={()=>setKiller(p.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded border text-left transition-all"
                style={killer===p.id ? {borderColor:'rgba(127,255,0,0.4)',background:'rgba(127,255,0,0.07)'} : {borderColor:'rgba(255,255,255,0.06)'}}>
                <Avatar player={p} size={28} glow="green"/>
                <span className="text-sm text-white/80">{p.name}</span>
                {killer===p.id && <span className="ml-auto text-neon-green text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-cyan flex-1" style={{opacity:0.5}}>Отмена</button>
          <button onClick={()=>{ if(victim) onConfirm(victim, killer==='none'?null:killer) }} disabled={!victim} className="btn btn-pink flex-1">Выбить</button>
        </div>
      </div>
    </div>
  )
}

export default function LiveGame() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [, tick] = useState(0)

  const game = getGame(gameId)
  const allPlayers = getPlayers()

  if (!game) return <div className="text-center py-20"><div className="text-white/30 mb-4">Игра не найдена</div><button onClick={()=>navigate('/')} className="btn btn-cyan">На главную</button></div>
  if (game.status==='completed') { navigate(`/live/${gameId}/results`, {replace:true}); return null }

  const pmap = Object.fromEntries(allPlayers.map(p=>[p.id,p]))
  const elim = new Set(game.eliminated.map(e=>e.playerId))
  const active = game.playerIds.filter(id=>!elim.has(id)).map(id=>pmap[id]).filter(Boolean)
  const done = [...game.eliminated].reverse()

  function onElim(victimId, killerId) {
    eliminatePlayer(gameId, victimId, killerId)
    setModal(false)
    tick(n=>n+1)
    const g = getGame(gameId)
    if (g?.status==='completed') setTimeout(()=>navigate(`/live/${gameId}/results`), 400)
  }

  return (
    <>
      {modal && <Modal players={active} onConfirm={onElim} onClose={()=>setModal(false)}/>}
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="live-dot"/>
              <span className="font-display text-red-400 text-[9px] tracking-widest">LIVE</span>
              <span className={game.type==='special'?'badge-special':'badge-season'}>{game.type==='special'?'Special':'Season'}</span>
            </div>
            <h1 className="font-display text-lg text-white">{game.title||'Покерная игра'}</h1>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-bold neon-cyan">{active.length}</div>
            <div className="label" style={{fontSize:'9px'}}>осталось</div>
          </div>
        </div>

        {/* Активные */}
        <div className="card p-4 mb-4">
          <div className="label mb-3">В игре</div>
          <div className="grid grid-cols-2 gap-2">
            {active.map(p=>{
              const kos = game.knockouts?.[p.id]||0
              return (
                <div key={p.id} className="flex items-center gap-2 p-2.5 rounded border border-neon-cyan/10 bg-neon-cyan/[0.02]">
                  <Avatar player={p} size={32}/>
                  <div className="min-w-0">
                    <div className="text-sm text-white/75 truncate">{p.name}</div>
                    {kos>0 && <div className="text-[10px] neon-green">+{kos} KO</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button onClick={()=>setModal(true)} disabled={active.length<=1} className="btn w-full mb-4 py-4"
          style={{border:'1px solid rgba(255,0,255,0.4)',color:'#ff00ff',background:'rgba(255,0,255,0.07)',fontFamily:'Orbitron',fontSize:'11px',letterSpacing:'0.15em',boxShadow:'0 0 15px rgba(255,0,255,0.08)'}}>
          Выбить игрока
        </button>

        {done.length>0 && (
          <div className="card p-4">
            <div className="label mb-3">Выбыли</div>
            <div className="space-y-2">
              {done.map(e=>{
                const p = pmap[e.playerId]
                const k = e.eliminatedBy ? pmap[e.eliminatedBy] : null
                return (
                  <div key={e.playerId} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="font-mono text-xs text-white/25 w-5 text-center flex-shrink-0">{e.place}</span>
                    <Avatar player={p} size={28}/>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white/60">{p?.name}</span>
                      {k && <span className="text-[10px] text-neon-green ml-1.5">← {k.name}</span>}
                    </div>
                    <span className="font-mono font-bold text-sm neon-cyan">{e.totalPoints}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
