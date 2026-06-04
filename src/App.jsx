import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Games from './pages/Games.jsx'
import GameDetail from './pages/GameDetail.jsx'
import PlayerProfile from './pages/PlayerProfile.jsx'
import Seasons from './pages/Seasons.jsx'
import LiveSetup from './pages/live/LiveSetup.jsx'
import LiveGame from './pages/live/LiveGame.jsx'
import LiveResults from './pages/live/LiveResults.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminGuard from './pages/admin/AdminGuard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminPlayers from './pages/admin/AdminPlayers.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Leaderboard/>}/>
        <Route path="/games" element={<Games/>}/>
        <Route path="/game/:id" element={<GameDetail/>}/>
        <Route path="/player/:id" element={<PlayerProfile/>}/>
        <Route path="/seasons" element={<Seasons/>}/>
        <Route path="/live/setup" element={<LiveSetup/>}/>
        <Route path="/live/:gameId" element={<LiveGame/>}/>
        <Route path="/live/:gameId/results" element={<LiveResults/>}/>
      </Route>
      <Route path="/admin" element={<AdminLogin/>}/>
      <Route element={<AdminGuard/>}>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/players" element={<AdminPlayers/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}
