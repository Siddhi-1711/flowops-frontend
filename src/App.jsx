import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Templates from './pages/Templates'
import Requests from './pages/Requests'
import Approvals from './pages/Approvals'
import Users from './pages/Users'
import Layout from './components/Layout'

function getUser() {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!token || !user) return null

    // Check JWT expiry from token payload (middle part)
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }

    return user
  } catch {
    return null
  }
}

// Requires valid non-expired token
const PrivateRoute = ({ children }) => {
  const user = getUser()
  return user ? children : <Navigate to="/login" replace />
}

// Requires valid token + one of the allowed roles
const RoleRoute = ({ children, roles }) => {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
      </Route>

      <Route path="/requests" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Requests />} />
      </Route>

      <Route path="/approvals" element={
        <RoleRoute roles={['COMPANY_ADMIN', 'APPROVER']}><Layout /></RoleRoute>
      }>
        <Route index element={<Approvals />} />
      </Route>

      <Route path="/templates" element={
        <RoleRoute roles={['COMPANY_ADMIN']}><Layout /></RoleRoute>
      }>
        <Route index element={<Templates />} />
      </Route>

      <Route path="/users" element={
        <RoleRoute roles={['COMPANY_ADMIN']}><Layout /></RoleRoute>
      }>
        <Route index element={<Users />} />
      </Route>
    </Routes>
  )
}