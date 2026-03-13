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

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>{title}</h1>
      {subtitle && <p style={{ color: 'var(--muted)', fontSize: 14 }}>{subtitle}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [requests, setRequests] = useState([])
  const user    = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'COMPANY_ADMIN'

  useEffect(() => {
    if (isAdmin) {
      api.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {})
      api.get('/api/admin/requests').then(r => setRequests(r.data)).catch(() => {})
    } else {
      api.get('/api/requests/my').then(r => setRequests(r.data)).catch(() => {})
    }
  }, [])

  const statCards = stats ? [
    { label: 'Total',    value: stats.total,    color: 'var(--accent2)' },
    { label: 'Pending',  value: stats.pending,  color: '#f59e0b' },
    { label: 'Approved', value: stats.approved, color: '#10b981' },
    { label: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ] : []

  return (
    <div>
      <PageHeader
        title={isAdmin ? 'Overview' : 'My Dashboard'}
        subtitle={isAdmin ? 'All activity across your organisation.' : `Welcome back, ${user.email}`}
      />

      {isAdmin && statCards.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {statCards.map(s => (
            <div key={s.label} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px 20px 16px',
            }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 30, fontWeight: 600, color: s.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{isAdmin ? 'All requests' : 'My requests'}</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{requests.length} total</span>
        </div>

        {requests.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No requests yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Title', 'Template', isAdmin && 'Submitted by', 'Status', 'Date'].filter(Boolean).map(h => (
                  <th key={h} style={{
                    padding: '10px 20px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: 'var(--muted)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r.id} style={{
                  borderBottom: i < requests.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .1s',
                }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 20px', fontWeight: 500 }}>{r.title}</td>
                  <td style={{ padding: '12px 20px', color: 'var(--muted)' }}>{r.templateName}</td>
                  {isAdmin && <td style={{ padding: '12px 20px', color: 'var(--muted)' }}>{r.submittedBy}</td>}
                  <td style={{ padding: '12px 20px' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: '12px 20px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>
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