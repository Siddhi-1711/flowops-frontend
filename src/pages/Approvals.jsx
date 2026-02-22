import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Approvals() {
  const [pending, setPending] = useState([])
  const [comment, setComment] = useState({})
  const [done, setDone] = useState([])

  useEffect(() => {
    api.get('/api/approvals/pending').then(r => setPending(r.data))
  }, [])

  const act = async (requestId, action) => {
    if (!comment[requestId]?.trim()) {
      alert('Comment is required')
      return
    }
    try {
      await api.post(`/api/approvals/${action}`, { requestId, comment: comment[requestId] })
      setDone([...done, requestId])
      setPending(pending.filter(r => r.id !== requestId))
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pending Approvals</h2>

      {pending.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 text-gray-400">
          No pending approvals. You're all caught up!
        </div>
      ) : pending.map(r => (
        <div key={r.id} className="bg-gray-800 rounded-xl p-6 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-gray-400 text-sm">{r.templateName} • Submitted by {r.submittedBy}</p>
            </div>
            <span className="bg-yellow-900 text-yellow-300 text-xs px-2 py-1 rounded">Stage {r.currentStageOrder}</span>
          </div>

          {r.description && <p className="text-gray-300 text-sm mb-3">{r.description}</p>}

          <div className="flex gap-2 mb-4 flex-wrap">
            {r.stages.map(s => (
              <div key={s.id} className={`text-xs px-3 py-1 rounded-full border ${
                s.status === 'APPROVED' ? 'border-green-600 text-green-400' :
                s.status === 'PENDING' ? 'border-yellow-600 text-yellow-400' :
                'border-gray-600 text-gray-400'
              }`}>
                {s.stageOrder}. {s.stageName} ({s.status})
              </div>
            ))}
          </div>

          <textarea
            value={comment[r.id] || ''}
            onChange={e => setComment({...comment, [r.id]: e.target.value})}
            placeholder="Add a comment (required)..."
            rows={2}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 mb-3"
          />

          <div className="flex gap-2">
            <button onClick={() => act(r.id, 'approve')}
              className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
              Approve
            </button>
            <button onClick={() => act(r.id, 'reject')}
              className="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}