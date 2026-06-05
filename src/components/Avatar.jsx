export default function Avatar({ player, size = 40, glow = 'pink' }) {
  const styles = {
    pink:   { border: '2px solid #ff2d78', shadow: '0 0 12px rgba(255,45,120,0.6)' },
    gold:   { border: '2px solid #ffd700', shadow: '0 0 12px rgba(255,215,0,0.5)' },
    green:  { border: '2px solid #00ff9f', shadow: '0 0 12px rgba(0,255,159,0.5)' },
    blue:   { border: '2px solid #00cfff', shadow: '0 0 12px rgba(0,207,255,0.5)' },
    teal:   { border: '2px solid #00cfff', shadow: '0 0 10px rgba(0,207,255,0.4)' },
    purple: { border: '2px solid #8b00ff', shadow: '0 0 12px rgba(139,0,255,0.5)' },
  }
  const { border, shadow } = styles[glow] || styles.pink
  const style = { width: size, height: size, minWidth: size, borderRadius: '50%', border, boxShadow: shadow, objectFit: 'cover', flexShrink: 0 }
  const initials = player?.name ? player.name.slice(0, 2).toUpperCase() : '?'

  if (player?.photoBase64) return <img src={player.photoBase64} alt={player?.name} style={style} />

  return (
    <div style={{ ...style, background: '#0d0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#ffd700', fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: size * 0.28 }}>{initials}</span>
    </div>
  )
}
