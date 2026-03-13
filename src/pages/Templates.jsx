import { useState, useEffect } from 'react'
import api from '../api/axios'

const inputStyle = {
  width: '100%', padding: '9px 13px',
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--text)',
  fontSize: 14, fontFamily: 'var(--font)', outline: 'none',
  transition: 'border-color .15s',
}

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', stages: [{ name: '', stageOrder: 1, approverId: '', approvalMode: 'ANY_ONE' }] })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/api/templates').then(r => setTemplates(r.data)).catch(() => {})
    api.get('/api/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const addStage = () => setForm({
    ...form, stages: [...form.stages, { name: '', stageOrder: form.stages.length + 1, approverId: '', approvalMode: 'ANY_ONE' }]
  })

  const removeStage = (i) => {
    if (form.stages.length === 1) return
    const stages = form.stages.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stageOrder: idx + 1 }))
    setForm({ ...form, stages })
  }

  const updateStage = (i, field, value) => {
    const stages = [...form.stages]
    stages[i][field] = value
    setForm({ ...form, stages })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post('/api/templates', form)
      setTemplates([...templates, res.data])
      setShowForm(false)
      setForm({ name: '', description: '', stages: [{ name: '', stageOrder: 1, approverId: '', approvalMode: 'ANY_ONE' }] })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create template')
    } finally {
      setSubmitting(false)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Templates</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Design reusable multi-stage approval workflows.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError('') }} style={{
          padding: '8px 16px', background: showForm ? 'transparent' : 'var(--accent)',
          border: showForm ? '1px solid var(--border2)' : 'none',
          borderRadius: 'var(--radius)', color: showForm ? 'var(--muted)' : '#fff',
          fontSize: 13, fontFamily: 'var(--font)', fontWeight: 500, cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ New template'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 20,
        }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Create template</h3>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius)', padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Template name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Finance Review" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Description <span style={{ fontWeight: 400 }}>(optional)</span></label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description…" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>Stages</label>
                <button type="button" onClick={addStage} style={{
                  background: 'transparent', border: 'none', color: 'var(--accent2)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500,
                }}>+ Add stage</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.stages.map((stage, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '28px 1fr 1fr auto', gap: 8, alignItems: 'center',
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '10px 12px',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <input value={stage.name} onChange={e => updateStage(i, 'name', e.target.value)}
                      placeholder={`Stage ${i + 1} name`} required
                      style={{ ...inputStyle, background: 'var(--bg2)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <select value={stage.approverId} onChange={e => updateStage(i, 'approverId', e.target.value)} required
                      style={{ ...inputStyle, background: 'var(--bg2)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    >
                      <option value="">Select approver…</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                    </select>
                    <button type="button" onClick={() => removeStage(i)} style={{
                      background: 'transparent', border: 'none', color: 'var(--muted)',
                      cursor: form.stages.length === 1 ? 'not-allowed' : 'pointer',
                      fontSize: 16, lineHeight: 1, opacity: form.stages.length === 1 ? 0.3 : 1,
                    }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={submitting} style={{
              padding: '9px', background: submitting ? 'var(--border2)' : 'var(--accent)',
              border: 'none', borderRadius: 'var(--radius)', color: '#fff',
              fontSize: 13, fontFamily: 'var(--font)', fontWeight: 500,
              cursor: submitting ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', minWidth: 140,
            }}>
              {submitting ? 'Creating…' : 'Create template'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {templates.length === 0 ? (
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14,
          }}>No templates yet. Create your first workflow above.</div>
        ) : templates.map(t => (
          <div key={t.id} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '18px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 999, fontWeight: 600, letterSpacing: '0.05em',
                  color: t.isPublished ? '#10b981' : '#f59e0b',
                  background: t.isPublished ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${t.isPublished ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  fontFamily: 'var(--mono)',
                }}>{t.isPublished ? 'PUBLISHED' : 'DRAFT'}</span>
              </div>
              {t.description && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{t.description}</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {t.stages?.map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {i > 0 && <div style={{ width: 14, height: 1, background: 'var(--border2)' }} />}
                    <span style={{
                      fontSize: 11, padding: '2px 9px', borderRadius: 999,
                      color: 'var(--accent2)', background: 'rgba(59,130,246,0.08)',
                      border: '1px solid rgba(59,130,246,0.15)',
                    }}>
                      {s.stageOrder}. {s.stageName || s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {!t.isPublished && (
              <div style={{ display: 'flex', gap: 8, marginLeft: 16, flexShrink: 0 }}>
                <button onClick={() => publish(t.id)} style={{
                  padding: '6px 14px', background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius)',
                  color: '#10b981', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500,
                }}>Publish</button>
                <button onClick={() => deleteTemplate(t.id)} style={{
                  padding: '6px 14px', background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius)',
                  color: '#ef4444', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500,
                }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}