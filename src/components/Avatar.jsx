export default function Avatar({ player, size=40, glow='cyan' }) {
  const border = glow==='pink' ? '2px solid #ff00ff' : glow==='green' ? '2px solid #7fff00' : '2px solid #00f5ff'
  const shadow = glow==='pink' ? '0 0 10px rgba(255,0,255,0.5)' : glow==='green' ? '0 0 10px rgba(127,255,0,0.4)' : '0 0 10px rgba(0,245,255,0.4)'
  const style = { width:size, height:size, minWidth:size, borderRadius:'50%', border, boxShadow:shadow, objectFit:'cover', flexShrink:0 }
  const initials = player?.name ? player.name.slice(0,2).toUpperCase() : '?'

  if (player?.photoBase64) return <img src={player.photoBase64} alt={player?.name} style={style} />

  return (
    <div style={{...style, background:'#0d0d20', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <span style={{color:'#00f5ff', fontFamily:'JetBrains Mono', fontWeight:700, fontSize:size*0.28}}>{initials}</span>
    </div>
  )
}
