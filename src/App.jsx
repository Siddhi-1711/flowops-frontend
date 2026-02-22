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

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
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
      <Route path="/templates" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Templates />} />
      </Route>
      <Route path="/requests" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Requests />} />
      </Route>
      <Route path="/approvals" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Approvals />} />
      </Route>
      <Route path="/users" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Users />} />
      </Route>
    </Routes>
  )
}