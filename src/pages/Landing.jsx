import { useNavigate } from 'react-router-dom'

const features = [
  { label: 'Multi-stage workflows', desc: 'Chain approvers in sequence — each stage unlocks only when the previous is cleared.' },
  { label: 'Role-based access', desc: 'Admins, approvers, and employees each see exactly what they need — nothing more.' },
  { label: 'Full audit trail', desc: 'Every approval, rejection, and comment is logged with timestamps. Nothing is lost.' },
  { label: 'Real-time status', desc: 'Watch requests move through stages live. No refresh, no guessing.' },
  { label: 'Multi-tenant', desc: 'Each company is fully isolated. Your data never touches another organisation.' },
  { label: 'Instant withdrawals', desc: 'Change your mind? Pull a pending request before it reaches the next stage.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)' }}>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '48px 48px', opacity: 0.35,
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Nav */}
        <nav style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 48px', borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)', background: 'rgba(8,12,18,0.8)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: '#fff', fontFamily: 'var(--mono)',
            }}>F</div>
            <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.02em' }}>FlowOps</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid var(--border2)',
              borderRadius: 'var(--radius)', color: 'var(--muted)', cursor: 'pointer',
              fontSize: 14, fontFamily: 'var(--font)', fontWeight: 500,
              transition: 'all .15s',
            }}
              onMouseOver={e => { e.target.style.color = 'var(--text)'; e.target.style.borderColor = 'var(--accent)'; }}
              onMouseOut={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--border2)'; }}
            >Sign in</button>
            <button onClick={() => navigate('/register')} style={{
              padding: '8px 18px', background: 'var(--accent)', border: 'none',
              borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontFamily: 'var(--font)', fontWeight: 500,
              transition: 'background .15s',
            }}
              onMouseOver={e => e.target.style.background = '#2563eb'}
              onMouseOut={e => e.target.style.background = 'var(--accent)'}
            >Get started</button>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '100px 24px 80px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 999, padding: '5px 14px', marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: 'var(--accent2)', fontWeight: 500 }}>Workflow automation for modern teams</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 600,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            maxWidth: 720, margin: '0 auto 24px',
          }}>
            Approval workflows
            <span style={{ display: 'block', color: 'var(--accent)' }}>without the chaos</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Build multi-stage approval chains, track every request in real time,
            and keep your entire team on the same page.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{
              padding: '13px 28px', background: 'var(--accent)', border: 'none',
              borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer',
              fontSize: 15, fontFamily: 'var(--font)', fontWeight: 500,
              transition: 'background .15s',
            }}
              onMouseOver={e => e.target.style.background = '#2563eb'}
              onMouseOut={e => e.target.style.background = 'var(--accent)'}
            >Start for free →</button>
            <button onClick={() => navigate('/login')} style={{
              padding: '13px 28px', background: 'transparent',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--radius)', color: 'var(--text)', cursor: 'pointer',
              fontSize: 15, fontFamily: 'var(--font)', fontWeight: 500,
              transition: 'border-color .15s',
            }}
              onMouseOver={e => e.target.style.borderColor = 'var(--accent)'}
              onMouseOut={e => e.target.style.borderColor = 'var(--border2)'}
            >Sign in</button>
          </div>
        </section>

        {/* Mock dashboard preview */}
        <section style={{ padding: '0 48px 80px', maxWidth: 960, margin: '0 auto' }}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            boxShadow: '0 0 0 1px var(--border), 0 24px 64px rgba(0,0,0,0.5)',
          }}>
            {/* Mock toolbar */}
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <div style={{
                flex: 1, background: 'var(--bg2)', borderRadius: 6, padding: '4px 12px',
                fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', marginLeft: 8,
              }}>app.flowops.io/dashboard</div>
            </div>
            {/* Mock stats */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Total', value: '248', color: 'var(--accent)' },
                { label: 'Pending', value: '34', color: 'var(--amber)' },
                { label: 'Approved', value: '198', color: 'var(--green)' },
                { label: 'Rejected', value: '16', color: 'var(--red)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '16px',
                }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 600, color: s.color, fontFamily: 'var(--mono)' }}>{s.value}</div>
                </div>
              ))}
            </div>
            {/* Mock table rows */}
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { title: 'Q4 Budget Approval', template: 'Finance Review', status: 'PENDING', color: 'var(--amber)' },
                { title: 'New Vendor Onboarding', template: 'Procurement', status: 'APPROVED', color: 'var(--green)' },
                { title: 'Office Lease Renewal', template: 'Legal Review', status: 'PENDING', color: 'var(--amber)' },
              ].map(r => (
                <div key={r.title} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '12px 16px',
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.template}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px',
                    borderRadius: 999, color: r.color,
                    background: r.color === 'var(--green)' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    fontFamily: 'var(--mono)', letterSpacing: '0.04em',
                  }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '0 48px 100px', maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 12 }}>Everything you need</h2>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>Built for teams that take approvals seriously.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <div key={f.label} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px',
                transition: 'border-color .2s',
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, marginBottom: 16,
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500, color: 'var(--accent)',
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{f.label}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          margin: '0 48px 80px', maxWidth: 960, marginLeft: 'auto', marginRight: 'auto',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 'var(--radius-lg)', padding: '56px 48px', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ready to fix your approval process?
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 16 }}>
            Set up your company in under 2 minutes. No credit card required.
          </p>
          <button onClick={() => navigate('/register')} style={{
            padding: '13px 32px', background: 'var(--accent)', border: 'none',
            borderRadius: 'var(--radius)', color: '#fff', cursor: 'pointer',
            fontSize: 15, fontFamily: 'var(--font)', fontWeight: 500,
          }}>Create your account →</button>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border)', padding: '24px 48px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>FlowOps</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Built with Spring Boot & React</span>
        </footer>

      </div>
    </div>
  )
}