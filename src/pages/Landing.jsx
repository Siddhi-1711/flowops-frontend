import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">FlowOps</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Login
          </button>
          <button onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-8 py-24">
        <span className="bg-blue-900 text-blue-300 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Workflow Automation for Modern Teams
        </span>
        <h2 className="text-5xl font-bold mb-6 max-w-3xl leading-tight">
          Streamline Your Approval Workflows
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Create multi-stage approval workflows, track requests in real time,
          and keep your team aligned — all in one place.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/register')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            Start for Free
          </button>
          <button onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">
            Sign In
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-6 px-16 pb-24">
        {[
          {
            icon: '🔀',
            title: 'Multi-Stage Workflows',
            desc: 'Design approval chains with multiple stages, each with dedicated approvers and approval modes.'
          },
          {
            icon: '🔐',
            title: 'Role-Based Access',
            desc: 'Company admins, approvers, and employees each see exactly what they need — nothing more.'
          },
          {
            icon: '📊',
            title: 'Real-Time Tracking',
            desc: 'Track every request through its lifecycle with full audit logs and live status updates.'
          },
          {
            icon: '✅',
            title: 'One-Click Approvals',
            desc: 'Approvers get a dedicated queue and can approve or reject with a mandatory comment.'
          },
          {
            icon: '🏢',
            title: 'Multi-Tenant',
            desc: 'Each company gets its own isolated workspace — data is never shared across organizations.'
          },
          {
            icon: '📋',
            title: 'Audit Trail',
            desc: 'Every action is logged. Know who approved what, when, and why — always.'
          },
        ].map(f => (
          <div key={f.title} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-8 py-6 text-center text-gray-500 text-sm">
        © 2026 FlowOps. Built with Spring Boot & React.
      </div>
    </div>
  )
}