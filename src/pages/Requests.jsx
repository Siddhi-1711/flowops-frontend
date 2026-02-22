import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Requests() {
  const [requests, setRequests] = useState([])
  const [templates, setTemplates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ templateId: '', title: '', description: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/requests/my').then(r => setRequests(r.data))
    api.get('/api/templates/published').then(r => setTemplates(r.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/requests', form)
      setRequests([res.data, ...requests])
      setShowForm(false)
      setForm({ templateId: '', title: '', description: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request')
    }
  }

  const withdraw = async (id) => {
    const res = await api.put(`/api/requests/${id}/withdraw`)
    setRequests(requests.map(r => r.id === id ? res.data : r))
  }

  const statusColor = (status) => {
    if (status === 'APPROVED') return 'bg-green-900 text-green-300'
    if (status === 'REJECTED') return 'bg-red-900 text-red-300'
    if (status === 'WITHDRAWN') return 'bg-gray-700 text-gray-400'
    return 'bg-yellow-900 text-yellow-300'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Requests</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          {showForm ? 'Cancel' : '+ New Request'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Submit Request</h3>
          {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <select value={form.templateId} onChange={e => setForm({...form, templateId: e.target.value})} required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
              <option value="">Select workflow template</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Request title" required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Description (optional)" rows={3}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
              Submit Request
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {requests.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-gray-400">No requests yet.</div>
        ) : requests.map(r => (
          <div key={r.id} className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{r.templateName}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2 py-1 rounded font-medium ${statusColor(r.status)}`}>{r.status}</span>
                {r.status === 'PENDING' && (
                  <button onClick={() => withdraw(r.id)}
                    className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded">
                    Withdraw
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {r.stages.map(s => (
                <div key={s.id} className={`text-xs px-3 py-1 rounded-full border ${
                  s.status === 'APPROVED' ? 'border-green-600 text-green-400' :
                  s.status === 'REJECTED' ? 'border-red-600 text-red-400' :
                  s.status === 'PENDING' ? 'border-yellow-600 text-yellow-400' :
                  'border-gray-600 text-gray-400'
                }`}>
                  {s.stageOrder}. {s.stageName} → {s.approverName} ({s.status})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}