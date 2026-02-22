import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'EMPLOYEE' })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/users').then(r => setUsers(r.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/users', form)
      setUsers([...users, res.data])
      setShowForm(false)
      setForm({ fullName: '', email: '', password: '', role: 'EMPLOYEE' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user')
    }
  }

  const deactivate = async (id) => {
    const res = await api.put(`/api/users/${id}/deactivate`)
    setUsers(users.map(u => u.id === id ? res.data : u))
  }

  const roleColor = (role) => {
    if (role === 'COMPANY_ADMIN') return 'bg-blue-900 text-blue-300'
    if (role === 'APPROVER') return 'bg-purple-900 text-purple-300'
    return 'bg-gray-700 text-gray-300'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add User</h3>
          {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
              placeholder="Full name" required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              placeholder="Email" type="email" required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            <input value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Password" type="password" required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
              <option value="EMPLOYEE">Employee</option>
              <option value="APPROVER">Approver</option>
            </select>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
              Create User
            </button>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-700">
                <td className="py-3">{u.fullName}</td>
                <td className="py-3 text-gray-400">{u.email}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded ${roleColor(u.role)}`}>{u.role}</span>
                </td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded ${u.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3">
                  {u.isActive && u.role !== 'COMPANY_ADMIN' && (
                    <button onClick={() => deactivate(u.id)}
                      className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}