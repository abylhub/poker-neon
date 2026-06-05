export default function Avatar({ player, size = 40, glow = 'pink' }) {
  const colors = {
    pink:   { border: '2px solid #ff2d78', shadow: '0 0 10px rgba(255,45,120,0.5)' },
    teal:   { border: '2px solid #00d4ff', shadow: '0 0 10px rgba(0,212,255,0.4)' },
    purple: { border: '2px solid #9d00ff', shadow: '0 0 10px rgba(157,0,255,0.5)' },
    green:  { border: '2px solid #06ffa5', shadow: '0 0 10px rgba(6,255,165,0.4)' },
  }
  const { border, shadow } = colors[glow] || colors.pink
  const style = { width: size, height: size, minWidth: size, borderRadius: '50%', border, boxShadow: shadow, objectFit: 'cover', flexShrink: 0 }
  const initials = player?.name ? player.name.slice(0, 2).toUpperCase() : '?'

  if (player?.photoBase64) return <img src={player.photoBase64} alt={player?.name} style={style} />

  return (
    <div style={{ ...style, background: '#1a1230', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#ff2d78', fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: size * 0.28 }}>{initials}</span>
    </div>
  )
}
