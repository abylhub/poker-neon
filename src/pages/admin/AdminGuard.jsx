import { Navigate, Outlet } from 'react-router-dom'
import { isAdminLoggedIn } from '../../data/store.js'
export default function AdminGuard() {
  return isAdminLoggedIn() ? <Outlet/> : <Navigate to="/admin" replace/>
}
