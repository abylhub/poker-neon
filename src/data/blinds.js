// Структура уровней блайндов
export const BLIND_LEVELS = [
  { sb: 25, bb: 50 },
  { sb: 50, bb: 100 },
  { sb: 75, bb: 150 },
  { sb: 100, bb: 200 },
  { sb: 150, bb: 300 },
  { sb: 200, bb: 400 },
  { sb: 300, bb: 600 },
  { sb: 400, bb: 800 },
  { sb: 600, bb: 1200 },
  { sb: 800, bb: 1600 },
  { sb: 1000, bb: 2000 },
  { sb: 1500, bb: 3000 },
]

// Текущий уровень не хранится в базе — он выводится из startedAt/pausedTotal,
// поэтому все устройства считают его одинаково и никто не пишет в Firestore
// в момент смены уровня (нет гонок между клиентами).
export function getTimerState(timer, now = Date.now()) {
  if (!timer?.levelMinutes) return null
  const levelMs = timer.levelMinutes * 60 * 1000
  const effectiveNow = timer.pausedAt ?? now
  const elapsed = Math.max(0, effectiveNow - timer.startedAt - (timer.pausedTotal || 0))
  const rawIndex = Math.floor(elapsed / levelMs)
  const levelIndex = Math.min(rawIndex, BLIND_LEVELS.length - 1)
  const isLast = levelIndex === BLIND_LEVELS.length - 1
  return {
    levelIndex,
    level: BLIND_LEVELS[levelIndex],
    next: isLast ? null : BLIND_LEVELS[levelIndex + 1],
    remainingMs: isLast ? null : levelMs - (elapsed % levelMs),
    paused: !!timer.pausedAt,
  }
}

export function formatMs(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
