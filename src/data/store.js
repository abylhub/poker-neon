const K = { players:'pk2_players', games:'pk2_games', seasons:'pk2_seasons', settings:'pk2_settings' }

const load = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb } catch { return fb } }
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))

// Players
export const getPlayers = () => load(K.players, [])
export const savePlayers = (p) => save(K.players, p)
export const addPlayer = (name, photoBase64=null) => {
  const players = getPlayers()
  const p = { id: crypto.randomUUID(), name, photoBase64, createdAt: Date.now() }
  players.push(p); savePlayers(players); return p
}
export const updatePlayer = (id, upd) => savePlayers(getPlayers().map(p => p.id===id ? {...p,...upd} : p))
export const deletePlayer = (id) => savePlayers(getPlayers().filter(p => p.id!==id))

// Seasons
export const getSeasons = () => load(K.seasons, [])
export const saveSeasons = (s) => save(K.seasons, s)
export const getActiveSeason = () => getSeasons().find(s => s.isActive) ?? null
export const addSeason = (name) => {
  const seasons = getSeasons()
  seasons.forEach(s => s.isActive = false)
  const s = { id: crypto.randomUUID(), name, isActive: true, createdAt: Date.now() }
  seasons.push(s); saveSeasons(seasons); return s
}
export const closeSeason = (id) => saveSeasons(getSeasons().map(s => s.id===id ? {...s,isActive:false,closedAt:Date.now()} : s))

// Games
export const getGames = () => load(K.games, [])
export const saveGames = (g) => save(K.games, g)
export const getGame = (id) => getGames().find(g => g.id===id) ?? null
export const getLiveGame = () => getGames().find(g => g.status==='live') ?? null
export const getSeasonGames = (seasonId) => getGames().filter(g => g.seasonId===seasonId && g.status==='completed' && !g.isSpecial)
export const getAllCompletedGames = () => getGames().filter(g => g.status==='completed').sort((a,b) => b.date-a.date)
export const deleteGame = (id) => saveGames(getGames().filter(g => g.id!==id))

const PTS = { 1:25,2:18,3:15,4:12,5:10,6:8,7:6,8:4,9:2,10:1 }

export const createLiveGame = ({ type, seasonId, title, description, playerIds }) => {
  const game = {
    id: crypto.randomUUID(), type,
    seasonId: type==='season' ? seasonId : null,
    isSpecial: type==='special',
    title: title||null, description: description||null,
    date: Date.now(), status: 'live',
    playerIds: [...playerIds], eliminated: [], knockouts: {},
    createdAt: Date.now(),
  }
  const games = getGames(); games.push(game); saveGames(games); return game
}

export const eliminatePlayer = (gameId, victimId, killerId) => {
  const games = getGames()
  const game = games.find(g => g.id===gameId)
  if (!game || game.status!=='live') return null

  const eliminatedIds = new Set(game.eliminated.map(e => e.playerId))
  const remaining = game.playerIds.filter(id => !eliminatedIds.has(id))
  const place = remaining.length

  if (killerId) game.knockouts[killerId] = (game.knockouts[killerId]||0) + 1

  const kos = game.knockouts[victimId] || 0
  const pts = (PTS[place]||1) + kos

  game.eliminated.push({ playerId:victimId, eliminatedBy:killerId||null, place, knockouts:kos, pointsForPlace:PTS[place]||1, totalPoints:pts, eliminatedAt:Date.now() })

  const stillIn = remaining.filter(id => id!==victimId)
  if (stillIn.length === 1) {
    const wid = stillIn[0]
    const wkos = game.knockouts[wid]||0
    game.eliminated.push({ playerId:wid, eliminatedBy:null, place:1, knockouts:wkos, pointsForPlace:25, totalPoints:25+wkos, eliminatedAt:Date.now() })
    game.status = 'completed'
  }

  saveGames(games); return game
}

// Settings
export const getSettings = () => load(K.settings, { adminHash: null, leagueName: 'Poker League' })
export const saveSettings = (s) => save(K.settings, s)

const sha256 = async (s) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')
}
export const setAdminPassword = async (pw) => { const h = await sha256(pw); saveSettings({...getSettings(), adminHash:h}) }
export const checkAdminPassword = async (pw) => { const {adminHash} = getSettings(); if(!adminHash) return false; return (await sha256(pw))===adminHash }
export const isAdminLoggedIn = () => sessionStorage.getItem('pk_admin')==='1'
export const adminLogin = () => sessionStorage.setItem('pk_admin','1')
export const adminLogout = () => sessionStorage.removeItem('pk_admin')
