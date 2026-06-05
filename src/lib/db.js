import { db } from './firebase.js'
import {
  collection, doc, getDoc, getDocs, addDoc, setDoc,
  updateDoc, deleteDoc, onSnapshot, query, where, orderBy
} from 'firebase/firestore'

// ─── SHA-256 hash ───────────────────────────────────────────────────────────
export const sha256 = async (s) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ─── Players ────────────────────────────────────────────────────────────────
export const getPlayers = async () => {
  const snap = await getDocs(collection(db, 'players'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addPlayer = async (name, photoBase64 = null) => {
  const ref = await addDoc(collection(db, 'players'), { name, photoBase64, createdAt: Date.now() })
  return { id: ref.id, name, photoBase64 }
}

export const updatePlayer = async (id, updates) => {
  await updateDoc(doc(db, 'players', id), updates)
}

export const deletePlayer = async (id) => {
  await deleteDoc(doc(db, 'players', id))
}

// ─── Seasons ────────────────────────────────────────────────────────────────
export const getSeasons = async () => {
  const snap = await getDocs(collection(db, 'seasons'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getActiveSeason = async () => {
  const q = query(collection(db, 'seasons'), where('isActive', '==', true))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export const addSeason = async (name) => {
  // Деактивируем текущий
  const q = query(collection(db, 'seasons'), where('isActive', '==', true))
  const snap = await getDocs(q)
  for (const d of snap.docs) await updateDoc(d.ref, { isActive: false })
  // Создаём новый
  const ref = await addDoc(collection(db, 'seasons'), { name, isActive: true, createdAt: Date.now() })
  return { id: ref.id, name, isActive: true }
}

export const closeSeason = async (id) => {
  await updateDoc(doc(db, 'seasons', id), { isActive: false, closedAt: Date.now() })
}

// ─── Games ──────────────────────────────────────────────────────────────────
export const getGames = async () => {
  const snap = await getDocs(collection(db, 'games'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getGame = async (id) => {
  const snap = await getDoc(doc(db, 'games', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const getLiveGame = async () => {
  const q = query(collection(db, 'games'), where('status', '==', 'live'))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export const createLiveGame = async ({ type, seasonId, title, description, playerIds }) => {
  const ref = await addDoc(collection(db, 'games'), {
    type, seasonId: seasonId || null,
    isSpecial: type === 'special',
    title: title || null, description: description || null,
    date: Date.now(), status: 'live',
    playerIds, eliminated: [], knockouts: {},
    createdAt: Date.now(),
  })
  return { id: ref.id }
}

const PTS = { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 }

export const eliminatePlayer = async (gameId, victimId, killerId) => {
  const game = await getGame(gameId)
  if (!game || game.status !== 'live') return null

  const elimIds = new Set(game.eliminated.map(e => e.playerId))
  const remaining = game.playerIds.filter(id => !elimIds.has(id))
  const place = remaining.length

  const knockouts = { ...game.knockouts }
  if (killerId) knockouts[killerId] = (knockouts[killerId] || 0) + 1

  const kos = knockouts[victimId] || 0
  const pts = (PTS[place] || 1) + kos

  const newElim = [...game.eliminated, {
    playerId: victimId, eliminatedBy: killerId || null,
    place, knockouts: kos, pointsForPlace: PTS[place] || 1,
    totalPoints: pts, eliminatedAt: Date.now()
  }]

  const stillIn = remaining.filter(id => id !== victimId)
  let status = 'live'

  if (stillIn.length === 1) {
    const wid = stillIn[0]
    const wkos = knockouts[wid] || 0
    newElim.push({
      playerId: wid, eliminatedBy: null,
      place: 1, knockouts: wkos, pointsForPlace: 25,
      totalPoints: 25 + wkos, eliminatedAt: Date.now()
    })
    status = 'completed'
  }

  await updateDoc(doc(db, 'games', gameId), { eliminated: newElim, knockouts, status })
  return { ...game, eliminated: newElim, knockouts, status }
}

export const deleteGame = async (id) => {
  await deleteDoc(doc(db, 'games', id))
}

// ─── Settings ───────────────────────────────────────────────────────────────
export const getSettings = async () => {
  const snap = await getDoc(doc(db, 'settings', 'main'))
  return snap.exists() ? snap.data() : { adminHash: null, leagueName: 'Poker League' }
}

export const saveSettings = async (data) => {
  await setDoc(doc(db, 'settings', 'main'), data, { merge: true })
}

export const checkAdminPassword = async (pw) => {
  const settings = await getSettings()
  if (!settings.adminHash) return false
  return (await sha256(pw)) === settings.adminHash
}

export const setAdminPassword = async (pw) => {
  const hash = await sha256(pw)
  await saveSettings({ adminHash: hash })
}

export const isAdminPasswordSet = async () => {
  const s = await getSettings()
  return !!s.adminHash
}

// Session (device-local, не нужна синхронизация)
export const isAdminLoggedIn = () => sessionStorage.getItem('pk_admin') === '1'
export const adminLogin = () => sessionStorage.setItem('pk_admin', '1')
export const adminLogout = () => sessionStorage.removeItem('pk_admin')
