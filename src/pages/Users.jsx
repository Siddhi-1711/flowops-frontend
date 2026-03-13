import { useState, useEffect } from 'react'
import api from '../api/axios'

const inputStyle = {
  width: '100%', padding: '9px 13px',
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--text)',
  fontSize: 14, fontFamily: 'var(--font)', outline: 'none',
  transition: 'border-color .15s',
}

const roleMeta = {
  COMPANY_ADMIN: { color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  APPROVER:      { color: '#a78bfa', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)' },
  EMPLOYEE:      { color: '#6b7a96', bg: 'rgba(107,122,150,0.08)', border: 'rgba(107,122,150,0.2)' },
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'EMPLOYEE' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/api/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post('/api/users', form)
      setUsers([...users, res.data])
      setShowForm(false)
      setForm({ fullName: '', email: '', password: '', role: 'EMPLOYEE' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const deactivate = async (id) => {
    const res = await api.put(`/api/users/${id}/deactivate`)
    setUsers(users.map(u => u.id === id ? res.data : u))
  }

  const formFields = [
    { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'Jane Smith' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'jane@company.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Users</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{users.length} member{users.length !== 1 ? 's' : ''} in your organisation.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError('') }} style={{
          padding: '8px 16px', background: showForm ? 'transparent' : 'var(--accent)',
          border: showForm ? '1px solid var(--border2)' : 'none',
          borderRadius: 'var(--radius)', color: showForm ? 'var(--muted)' : '#fff',
          fontSize: 13, fontFamily: 'var(--font)', fontWeight: 500, cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ Add user'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 20,
        }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Add team member</h3>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius)', padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {formFields.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="APPROVER">Approver</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" disabled={submitting} style={{
                padding: '9px 24px', background: submitting ? 'var(--border2)' : 'var(--accent)',
                border: 'none', borderRadius: 'var(--radius)', color: '#fff',
                fontSize: 13, fontFamily: 'var(--font)', fontWeight: 500,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}>
                {submitting ? 'Creating…' : 'Create user'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        {users.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No users yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Role', 'Status', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 20px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: 'var(--muted)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rm = roleMeta[u.role] || roleMeta.EMPLOYEE
                return (
                  <tr key={u.id} style={{
                    borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                    opacity: u.isActive ? 1 : 0.5,
                    transition: 'background .1s',
                  }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 20px', fontWeight: 500 }}>{u.fullName}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 13 }}>{u.email}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        fontSize: 11, padding: '3px 9px', borderRadius: 999,
                        color: rm.color, background: rm.bg, border: `1px solid ${rm.border}`,
                        fontFamily: 'var(--mono)', fontWeight: 600, letterSpacing: '0.03em',
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        fontSize: 11, padding: '3px 9px', borderRadius: 999,
                        color: u.isActive ? '#10b981' : '#6b7a96',
                        background: u.isActive ? 'rgba(16,185,129,0.08)' : 'rgba(107,122,150,0.08)',
                        border: `1px solid ${u.isActive ? 'rgba(16,185,129,0.2)' : 'rgba(107,122,150,0.2)'}`,
                        fontFamily: 'var(--mono)', fontWeight: 600,
                      }}>{u.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      {u.isActive && u.role !== 'COMPANY_ADMIN' && (
                        <button onClick={() => deactivate(u.id)} style={{
                          padding: '4px 12px', background: 'transparent',
                          border: '1px solid rgba(239,68,68,0.2)', borderRadius: 999,
                          color: '#ef4444', fontSize: 11, cursor: 'pointer',
                          fontFamily: 'var(--font)', fontWeight: 500, transition: 'all .15s',
                        }}
                          onMouseOver={e => e.target.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseOut={e => e.target.style.background = 'transparent'}
                        >Deactivate</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}