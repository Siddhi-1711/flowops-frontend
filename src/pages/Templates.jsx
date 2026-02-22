import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', stages: [{ name: '', stageOrder: 1, approverId: '', approvalMode: 'ANY_ONE' }] })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/templates').then(r => setTemplates(r.data))
    api.get('/api/users').then(r => setUsers(r.data))
  }, [])

  const addStage = () => {
    setForm({ ...form, stages: [...form.stages, { name: '', stageOrder: form.stages.length + 1, approverId: '', approvalMode: 'ANY_ONE' }] })
  }

  const updateStage = (i, field, value) => {
    const stages = [...form.stages]
    stages[i][field] = value
    setForm({ ...form, stages })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/templates', form)
      setTemplates([...templates, res.data])
      setShowForm(false)
      setForm({ name: '', description: '', stages: [{ name: '', stageOrder: 1, approverId: '', approvalMode: 'ANY_ONE' }] })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create template')
    }
  }

  const publish = async (id) => {
    const res = await api.put(`/api/templates/${id}/publish`)
    setTemplates(templates.map(t => t.id === id ? res.data : t))
  }

  const deleteTemplate = async (id) => {
    await api.delete(`/api/templates/${id}`)
    setTemplates(templates.filter(t => t.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Workflow Templates</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          {showForm ? 'Cancel' : '+ New Template'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Create Template</h3>
          {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Template name" required
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Description (optional)"
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-400">Stages</p>
                <button type="button" onClick={addStage} className="text-blue-400 text-sm hover:text-blue-300">+ Add Stage</button>
              </div>
              {form.stages.map((stage, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={stage.name} onChange={e => updateStage(i, 'name', e.target.value)}
                    placeholder={`Stage ${i + 1} name`} required
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  <select value={stage.approverId} onChange={e => updateStage(i, 'approverId', e.target.value)} required
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                    <option value="">Select approver</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>)}
                  </select>
                </div>
              ))}
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
              Create Template
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {templates.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-gray-400">No templates yet.</div>
        ) : templates.map(t => (
          <div key={t.id} className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{t.name}</h3>
                {t.description && <p className="text-gray-400 text-sm mt-1">{t.description}</p>}
                <div className="flex gap-2 mt-2">
                  {t.stages.map(s => (
                    <span key={s.id} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                      {s.stageOrder}. {s.stageName || s.name} → {s.approverName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2 py-1 rounded ${t.isPublished ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                  {t.isPublished ? 'Published' : 'Draft'}
                </span>
                {!t.isPublished && (
                  <>
                    <button onClick={() => publish(t.id)} className="bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1 rounded">Publish</button>
                    <button onClick={() => deleteTemplate(t.id)} className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}