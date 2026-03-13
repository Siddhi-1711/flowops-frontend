import { useState, useEffect } from 'react'
import api from '../api/axios'

const statusMeta = {
  APPROVED:  { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
  REJECTED:  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)'   },
  WITHDRAWN: { color: '#6b7a96', bg: 'rgba(107,122,150,0.08)', border: 'rgba(107,122,150,0.2)' },
  PENDING:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
}

function StatusBadge({ status }) {
  const m = statusMeta[status] || statusMeta.PENDING
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
      color: m.color, background: m.bg, border: `1px solid ${m.border}`,
      fontFamily: 'var(--mono)', letterSpacing: '0.04em',
    }}>{status}</span>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 13px',
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--text)',
  fontSize: 14, fontFamily: 'var(--font)', outline: 'none',
  transition: 'border-color .15s',
}

export default function Requests() {
  const [requests, setRequests] = useState([])
  const [templates, setTemplates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ templateId: '', title: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/api/requests/my').then(r => setRequests(r.data)).catch(() => {})
    api.get('/api/templates/published').then(r => setTemplates(r.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post('/api/requests', form)
      setRequests([res.data, ...requests])
      setShowForm(false)
      setForm({ templateId: '', title: '', description: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  const withdraw = async (id) => {
    try {
      const res = await api.put(`/api/requests/${id}/withdraw`)
      setRequests(requests.map(r => r.id === id ? res.data : r))
    } catch {}
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>My Requests</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Submit and track your approval requests.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError('') }} style={{
          padding: '8px 16px', background: showForm ? 'transparent' : 'var(--accent)',
          border: showForm ? '1px solid var(--border2)' : 'none',
          borderRadius: 'var(--radius)', color: showForm ? 'var(--muted)' : '#fff',
          fontSize: 13, fontFamily: 'var(--font)', fontWeight: 500, cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ New request'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 20,
        }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Submit a request</h3>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius)', padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Workflow template</label>
              <select value={form.templateId} onChange={e => setForm({ ...form, templateId: e.target.value })} required
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              >
                <option value="">Select a template…</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Request title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Q4 Budget Approval" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Description <span style={{ fontWeight: 400 }}>(optional)</span></label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Add context for your approvers…" rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <button type="submit" disabled={submitting} style={{
              padding: '9px', background: submitting ? 'var(--border2)' : 'var(--accent)',
              border: 'none', borderRadius: 'var(--radius)', color: '#fff',
              fontSize: 13, fontFamily: 'var(--font)', fontWeight: 500,
              cursor: submitting ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', minWidth: 130,
            }}>
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {requests.length === 0 ? (
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14,
          }}>No requests yet. Submit your first one above.</div>
        ) : requests.map(r => (
          <div key={r.id} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.templateName}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusBadge status={r.status} />
                {r.status === 'PENDING' && (
                  <button onClick={() => withdraw(r.id)} style={{
                    padding: '3px 10px', background: 'transparent',
                    border: '1px solid var(--border2)', borderRadius: 999,
                    color: 'var(--muted)', fontSize: 11, cursor: 'pointer',
                    fontFamily: 'var(--font)', transition: 'all .15s',
                  }}
                    onMouseOver={e => { e.target.style.color = '#fca5a5'; e.target.style.borderColor = 'rgba(239,68,68,0.3)' }}
                    onMouseOut={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--border2)' }}
                  >Withdraw</button>
                )}
              </div>
            </div>

            {/* Stage pipeline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {r.stages?.map((s, i) => {
                const m = statusMeta[s.status] || statusMeta.PENDING
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {i > 0 && <div style={{ width: 16, height: 1, background: 'var(--border2)' }} />}
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 999,
                      color: m.color, background: m.bg, border: `1px solid ${m.border}`,
                    }}>
                      {s.stageOrder}. {s.stageName}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}