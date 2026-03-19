import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ companyName: '', adminName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await api.post('/api/auth/register', {
        companyName: form.companyName, adminName: form.adminName,
        email: form.email, password: form.password,
      })
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify({ email: res.data.email, role: res.data.role }))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'companyName', label: 'Company name', type: 'text', placeholder: 'Acme Corp' },
    { key: 'adminName', label: 'Your full name', type: 'text', placeholder: 'Jane Smith' },
    { key: 'email', label: 'Work email', type: 'email', placeholder: 'you@company.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { key: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--font)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 15, color: '#fff', fontFamily: 'var(--mono)',
          }}>F</div>
          <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>FlowOps</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>Create your workspace</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>Set up your company account in seconds.</p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 'var(--radius)', padding: '12px 16px',
            color: '#fca5a5', fontSize: 14, marginBottom: 20,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', color: 'var(--text)',
                  fontSize: 14, fontFamily: 'var(--font)', outline: 'none',
                  transition: 'border-color .15s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            padding: '11px', background: loading ? 'var(--border2)' : 'var(--accent)',
            border: 'none', borderRadius: 'var(--radius)', color: '#fff',
            fontSize: 14, fontFamily: 'var(--font)', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4,
            transition: 'background .15s',
          }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}