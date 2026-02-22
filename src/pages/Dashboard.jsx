import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [requests, setRequests] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'COMPANY_ADMIN'

  useEffect(() => {
    if (isAdmin) {
      api.get('/api/admin/stats').then(r => setStats(r.data))
      api.get('/api/admin/requests').then(r => setRequests(r.data))
    } else {
      api.get('/api/requests/my').then(r => setRequests(r.data))
    }
  }, [])

  const statusColor = (status) => {
    if (status === 'APPROVED') return 'text-green-400'
    if (status === 'REJECTED') return 'text-red-400'
    if (status === 'WITHDRAWN') return 'text-gray-400'
    return 'text-yellow-400'
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {isAdmin && stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-900 border-blue-700' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-900 border-yellow-700' },
            { label: 'Approved', value: stats.approved, color: 'bg-green-900 border-green-700' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-900 border-red-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} border rounded-xl p-4`}>
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          {isAdmin ? 'All Requests' : 'My Requests'}
        </h3>
        {requests.length === 0 ? (
          <p className="text-gray-400">No requests found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Template</th>
                {isAdmin && <th className="text-left py-2">Submitted By</th>}
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3">{r.title}</td>
                  <td className="py-3 text-gray-400">{r.templateName}</td>
                  {isAdmin && <td className="py-3 text-gray-400">{r.submittedBy}</td>}
                  <td className={`py-3 font-medium ${statusColor(r.status)}`}>{r.status}</td>
                  <td className="py-3 text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}