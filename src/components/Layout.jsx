import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const isAdmin = user.role === 'COMPANY_ADMIN'
  const isApprover = user.role === 'APPROVER' || user.role === 'COMPANY_ADMIN'

  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
    }`

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-56 bg-gray-800 flex flex-col p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-blue-400">FlowOps</h1>
          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded mt-1 inline-block">
            {user.role}
          </span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
          {isAdmin && <NavLink to="/templates" className={navClass}>Templates</NavLink>}
          <NavLink to="/requests" className={navClass}>Requests</NavLink>
          {isApprover && <NavLink to="/approvals" className={navClass}>Approvals</NavLink>}
          {isAdmin && <NavLink to="/users" className={navClass}>Users</NavLink>}
        </nav>

        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}