export const PLACE_POINTS = { 1:25,2:18,3:15,4:12,5:10,6:8,7:6,8:4,9:2,10:1 }

export const getResults = (game) => {
  if (game.eliminated?.length) return game.eliminated.map(e => ({ playerId:e.playerId, place:e.place, knockouts:e.knockouts||0, points:e.totalPoints||0 }))
  if (game.results?.length) return game.results.map(r => ({ playerId:r.playerId, place:r.place, knockouts:r.knockouts||0, points:r.points||((PLACE_POINTS[r.place]||0)+(r.knockouts||0)) }))
  return []
}

export const calcPlayerStats = (playerId, seasonGames) => {
  const rows = []
  for (const g of seasonGames) {
    if (g.status==='live') continue
    const r = getResults(g).find(r => r.playerId===playerId)
    if (!r) continue
    rows.push({ gameId:g.id, date:g.date, ...r })
  }
  rows.sort((a,b) => a.date-b.date)

  const pts = rows.map(r => r.points)
  const top7 = [...pts].sort((a,b)=>b-a).slice(0,7)
  const seasonPoints = top7.reduce((s,p)=>s+p,0)

  // Пометить какие игры идут в зачёт
  let rem = [...top7]
  const counted = new Set()
  for (const r of [...rows].sort((a,b)=>b.points-a.points)) {
    const i = rem.indexOf(r.points)
    if (i!==-1) { counted.add(r.gameId); rem.splice(i,1) }
  }

  return {
    playerId,
    gamesPlayed: rows.length,
    seasonPoints,
    wins: rows.filter(r=>r.place===1).length,
    top3: rows.filter(r=>r.place<=3).length,
    totalKnockouts: rows.reduce((s,r)=>s+(r.knockouts||0),0),
    best: pts.length ? Math.max(...pts) : 0,
    avg: pts.length ? Math.round(seasonPoints / Math.min(pts.length,7)) : 0,
    rows,
    counted,
  }
}

export const buildLeaderboard = (players, games) => {
  const stats = players.map(p => calcPlayerStats(p.id, games))
  stats.sort((a,b) => {
    if (b.seasonPoints!==a.seasonPoints) return b.seasonPoints-a.seasonPoints
    if (b.wins!==a.wins) return b.wins-a.wins
    return b.totalKnockouts-a.totalKnockouts
  })
  return stats.map((s,i) => ({...s, rank:i+1}))
}
