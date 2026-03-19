import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    companyName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await api.post('/api/auth/register', {
        companyName: form.companyName,
        adminName: form.adminName,
        email: form.email,
        password: form.password,
      })

      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem(
        'user',
        JSON.stringify({ email: res.data.email, role: res.data.role })
      )

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top, rgba(99,102,241,0.10), transparent 35%), var(--bg)',
        fontFamily: 'var(--font)',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: 18,
            padding: 0,
            transition: 'color 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted)'
          }}
        >
          <ArrowLeft size={16} />
          Back to home
        </button>

        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 15,
                color: '#fff',
                fontFamily: 'var(--mono)',
                boxShadow: '0 10px 24px rgba(99,102,241,0.25)',
              }}
            >
              F
            </div>

            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                FlowOps
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Workflow approvals platform
              </div>
            </div>
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 8,
              color: 'var(--text)',
            }}
          >
            Create your workspace
          </h1>

          <p
            style={{
              color: 'var(--muted)',
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 26,
            }}
          >
            Set up your company account and start managing approval workflows in minutes.
          </p>

          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '14px',
                padding: '12px 14px',
                color: '#fca5a5',
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 7,
                }}
              >
                Company name
              </label>

              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Acme Corp"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 7,
                }}
              >
                Your full name
              </label>

              <input
                type="text"
                value={form.adminName}
                onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                placeholder="Jane Smith"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 7,
                }}
              >
                Work email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)'
                  e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 7,
                }}
              >
                Password
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    color: 'var(--text)',
                    fontSize: 14,
                    fontFamily: 'var(--font)',
                    outline: 'none',
                    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)'
                    e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 7,
                }}
              >
                Confirm password
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    color: 'var(--text)',
                    fontSize: 14,
                    fontFamily: 'var(--font)',
                    outline: 'none',
                    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)'
                    e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                background: loading
                  ? 'var(--border2)'
                  : 'linear-gradient(135deg, var(--accent), var(--accent2))',
                border: 'none',
                borderRadius: '14px',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'var(--font)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 6,
                boxShadow: loading ? 'none' : '0 12px 30px rgba(99,102,241,0.22)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 16px 34px rgba(99,102,241,0.28)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.22)'
                }
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--accent2)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}