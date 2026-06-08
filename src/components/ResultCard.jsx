import { forwardRef } from 'react'
import Avatar from './Avatar.jsx'

const MEDALS = ['🥇', '🥈', '🥉']
const COLORS = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' }

// Этот компонент рендерится скрыто и захватывается html2canvas
const ResultCard = forwardRef(function ResultCard({ game, results, pmap }, ref) {
  const winner = results[0]
  const wp = winner ? pmap[winner.playerId] : null
  const date = game?.date
    ? new Date(game.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div ref={ref} style={{
      width: 420,
      background: 'linear-gradient(145deg, #0d0818 0%, #130d24 50%, #0a0614 100%)',
      borderRadius: 20,
      overflow: 'hidden',
      fontFamily: "'Montserrat', sans-serif",
      position: 'absolute',
      left: -9999,
      top: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid rgba(255,215,0,0.12)',
        background: 'rgba(255,215,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,215,0,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>
            ♠ POKER LEAGUE
          </div>
          <div style={{ fontSize: 13, color: 'rgba(240,230,255,0.5)', fontWeight: 400 }}>{date}</div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.15, fontFamily: 'serif', letterSpacing: 6 }}>♠ ♥</div>
      </div>

      {/* Winner */}
      {wp && (
        <div style={{ padding: '24px 24px 16px', textAlign: 'center', background: 'rgba(255,215,0,0.02)' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.35em', color: 'rgba(255,215,0,0.45)', textTransform: 'uppercase', marginBottom: 12 }}>
            Победитель
          </div>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
            {wp.photoBase64
              ? <img src={wp.photoBase64} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,215,0,0.4)' }} />
              : <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,45,120,0.2))',
                  border: '2px solid rgba(255,215,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, color: 'rgba(255,215,0,0.6)',
                }}>
                  {wp.name?.[0]?.toUpperCase() || '?'}
                </div>
            }
            <div style={{ position: 'absolute', top: -8, right: -8, fontSize: 22 }}>👑</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4, textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
            {wp.name}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,215,0,0.7)', fontFamily: 'monospace' }}>
            {winner.totalPoints} pts
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)', margin: '0 24px' }} />

      {/* Results table */}
      <div style={{ padding: '12px 0 8px' }}>
        {results.map((r, i) => {
          const p = pmap[r.playerId]
          const color = COLORS[r.place] || 'rgba(232,222,255,0.4)'
          const isTop = r.place <= 3
          return (
            <div key={r.playerId} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 24px',
              background: i === 0 ? 'rgba(255,215,0,0.04)' : 'transparent',
              borderBottom: '1px solid rgba(255,215,0,0.05)',
            }}>
              <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                {isTop
                  ? <span style={{ fontSize: 16 }}>{MEDALS[r.place - 1]}</span>
                  : <span style={{ fontSize: 13, color: 'rgba(232,222,255,0.25)', fontFamily: 'monospace' }}>{r.place}</span>
                }
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {p?.photoBase64
                  ? <img src={p.photoBase64} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, color: 'rgba(255,255,255,0.4)',
                    }}>{p?.name?.[0]?.toUpperCase()}</div>
                }
                <span style={{ fontSize: 13, fontWeight: isTop ? 600 : 400, color: isTop ? '#f0e6ff' : 'rgba(232,222,255,0.55)' }}>
                  {p?.name || '—'}
                </span>
              </div>
              {r.knockouts > 0 && (
                <span style={{ fontSize: 11, color: 'rgba(0,255,159,0.6)', fontFamily: 'monospace' }}>+{r.knockouts}KO</span>
              )}
              <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'monospace', minWidth: 36, textAlign: 'right' }}>
                {r.totalPoints}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 24px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: 'rgba(232,222,255,0.15)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          poker-neon
        </span>
        <span style={{ fontSize: 14, color: 'rgba(255,215,0,0.15)', fontFamily: 'serif', letterSpacing: 8 }}>♦ ♣</span>
      </div>
    </div>
  )
})

export default ResultCard
