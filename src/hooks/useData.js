import { useState, useEffect } from 'react'
import { db } from '../lib/firebase.js'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'

// Все игроки — реальное время
export function usePlayers() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'players'), snap => {
      setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])
  return { players, loading }
}

// Все игры — реальное время
export function useGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'games'), snap => {
      setGames(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])
  return { games, loading }
}

// Одна игра — реальное время
export function useGame(gameId) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!gameId) return
    const unsub = onSnapshot(doc(db, 'games', gameId), snap => {
      setGame(snap.exists() ? { id: snap.id, ...snap.data() } : null)
      setLoading(false)
    })
    return unsub
  }, [gameId])
  return { game, loading }
}

// Активный сезон — реальное время
export function useActiveSeason() {
  const [season, setSeason] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const q = query(collection(db, 'seasons'), where('isActive', '==', true))
    const unsub = onSnapshot(q, snap => {
      setSeason(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() })
      setLoading(false)
    })
    return unsub
  }, [])
  return { season, loading }
}

// Все сезоны
export function useSeasons() {
  const [seasons, setSeasons] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'seasons'), snap => {
      setSeasons(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt))
      setLoading(false)
    })
    return unsub
  }, [])
  return { seasons, loading }
}

// Живая игра — реальное время
export function useLiveGame() {
  const [liveGame, setLiveGame] = useState(undefined) // undefined = loading
  useEffect(() => {
    const q = query(collection(db, 'games'), where('status', '==', 'live'))
    const unsub = onSnapshot(q, snap => {
      setLiveGame(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() })
    })
    return unsub
  }, [])
  return liveGame
}
