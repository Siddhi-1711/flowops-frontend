import { useState, useEffect } from 'react'
import api from '../api/axios'

const stageStatusColor = {
  APPROVED: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  REJECTED: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  PENDING:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
}

const inputStyle = {
  width: '100%', padding: '9px 13px',
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--text)',
  fontSize: 13, fontFamily: 'var(--font)', outline: 'none',
  resize: 'vertical', transition: 'border-color .15s',
}

export default function Approvals() {
  const [pending, setPending] = useState([])
  const [comment, setComment] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState({})

  useEffect(() => {
    api.get('/api/approvals/pending').then(r => setPending(r.data)).catch(() => {})
  }, [])

  const act = async (requestId, action) => {
    if (!comment[requestId]?.trim()) {
      setErrors({ ...errors, [requestId]: 'A comment is required before you can ' + action })
      return
    }
    setLoading({ ...loading, [requestId]: action })
    try {
      await api.post(`/api/approvals/${action}`, { requestId, comment: comment[requestId] })
      setPending(pending.filter(r => r.id !== requestId))
    } catch (err) {
      setErrors({ ...errors, [requestId]: err.response?.data?.message || 'Action failed' })
    } finally {
      setLoading(l => ({ ...l, [requestId]: null }))
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Approvals</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          {pending.length === 0 ? "You're all caught up." : `${pending.length} request${pending.length > 1 ? 's' : ''} waiting for your decision.`}
        </p>
      </div>

      {pending.length === 0 ? (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '64px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>All clear</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>No pending approvals right now.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pending.map(r => (
            <div key={r.id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {r.templateName} · submitted by <span style={{ color: 'var(--text)' }}>{r.submittedBy}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 999,
                  color: '#f59e0b', background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  fontFamily: 'var(--mono)', fontWeight: 600,
                }}>Stage {r.currentStageOrder}</span>
              </div>

              <div style={{ padding: '16px 20px' }}>
                {/* Description */}
                {r.description && (
                  <p style={{
                    fontSize: 13, color: 'var(--muted)', marginBottom: 14,
                    padding: '10px 14px', background: 'var(--bg3)',
                    borderRadius: 'var(--radius)', borderLeft: '3px solid var(--border2)',
                  }}>{r.description}</p>
                )}

                {/* Stage pipeline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {r.stages?.map((s, i) => {
                    const m = stageStatusColor[s.status] || stageStatusColor.PENDING
                    return (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {i > 0 && <div style={{ width: 14, height: 1, background: 'var(--border2)' }} />}
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

                {/* Comment */}
                {errors[r.id] && (
                  <div style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 'var(--radius)', padding: '8px 12px',
                    color: '#fca5a5', fontSize: 12, marginBottom: 10,
                  }}>{errors[r.id]}</div>
                )}
                <textarea
                  value={comment[r.id] || ''}
                  onChange={e => {
                    setComment({ ...comment, [r.id]: e.target.value })
                    if (errors[r.id]) setErrors({ ...errors, [r.id]: null })
                  }}
                  placeholder="Add a comment (required)…"
                  rows={2}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => act(r.id, 'approve')} disabled={!!loading[r.id]} style={{
                    padding: '8px 18px', border: 'none',
                    background: loading[r.id] === 'approve' ? 'var(--border2)' : 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 'var(--radius)', color: '#10b981',
                    fontSize: 13, fontFamily: 'var(--font)', fontWeight: 600,
                    cursor: loading[r.id] ? 'not-allowed' : 'pointer', transition: 'all .15s',
                  }}
                    onMouseOver={e => { if (!loading[r.id]) e.currentTarget.style.background = 'rgba(16,185,129,0.2)' }}
                    onMouseOut={e => { if (!loading[r.id]) e.currentTarget.style.background = 'rgba(16,185,129,0.12)' }}
                  >
                    {loading[r.id] === 'approve' ? 'Approving…' : 'Approve'}
                  </button>
                  <button onClick={() => act(r.id, 'reject')} disabled={!!loading[r.id]} style={{
                    padding: '8px 18px',
                    background: loading[r.id] === 'reject' ? 'var(--border2)' : 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 'var(--radius)', color: '#ef4444',
                    fontSize: 13, fontFamily: 'var(--font)', fontWeight: 600,
                    cursor: loading[r.id] ? 'not-allowed' : 'pointer', transition: 'all .15s',
                  }}
                    onMouseOver={e => { if (!loading[r.id]) e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
                    onMouseOut={e => { if (!loading[r.id]) e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                  >
                    {loading[r.id] === 'reject' ? 'Rejecting…' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}