import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['COMPANY_ADMIN', 'APPROVER', 'EMPLOYEE'] },
  { to: '/requests', label: 'Requests', roles: ['COMPANY_ADMIN', 'APPROVER', 'EMPLOYEE'] },
  { to: '/approvals', label: 'Approvals', roles: ['COMPANY_ADMIN', 'APPROVER'] },
  { to: '/templates', label: 'Templates', roles: ['COMPANY_ADMIN'] },
  { to: '/users', label: 'Users', roles: ['COMPANY_ADMIN'] },
]

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const roleColor = { COMPANY_ADMIN: 'var(--accent)', APPROVER: 'var(--purple)', EMPLOYEE: 'var(--green)' }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font)', background: 'var(--bg)' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        padding: '20px 12px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px', marginBottom: 28 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, color: '#fff', fontFamily: 'var(--mono)', flexShrink: 0,
          }}>F</div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>FlowOps</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems
            .filter(item => item.roles.includes(user.role))
            .map(item => (
              <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
                display: 'block', padding: '8px 12px', borderRadius: 'var(--radius)',
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all .15s',
              })}>
                {item.label}
              </NavLink>
            ))}
        </nav>

        {/* User info */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8,
        }}>
          <div style={{ padding: '0 8px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 999,
              color: roleColor[user.role] || 'var(--muted)',
              background: 'rgba(59,130,246,0.08)',
              fontFamily: 'var(--mono)', fontWeight: 500, letterSpacing: '0.03em',
            }}>{user.role}</span>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '8px 12px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            color: 'var(--muted)', cursor: 'pointer', fontSize: 13,
            fontFamily: 'var(--font)', fontWeight: 500, transition: 'all .15s', textAlign: 'left',
          }}
            onMouseOver={e => { e.target.style.color = '#fca5a5'; e.target.style.borderColor = 'rgba(239,68,68,0.3)'; }}
            onMouseOut={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--border)'; }}
          >Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '32px 36px' }}>
        <Outlet />
      </main>
    </div>
  )
}