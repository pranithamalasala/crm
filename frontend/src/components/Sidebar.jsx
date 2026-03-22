import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GitBranch, BarChart3,
  Settings, LogOut, Zap, Bell, HelpCircle
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Users, label: 'Leads', to: '/leads' },
  { icon: GitBranch, label: 'Pipeline', to: '/pipeline' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
]

const bottomItems = [
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: HelpCircle, label: 'Help', to: '/help' },
  { icon: Settings, label: 'Settings', to: '/settings' },
]

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate()

  return (
    <aside className="w-60 flex-shrink-0 bg-slate-900/80 border-r border-slate-800/60 flex flex-col backdrop-blur-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-blue">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight">Nexus</span>
            <span className="font-bold text-brand-400 text-sm tracking-tight">CRM</span>
          </div>
          <span className="ml-auto text-[10px] font-mono bg-brand-600/20 text-brand-400 px-1.5 py-0.5 rounded border border-brand-500/20">
            v2.4
          </span>
        </div>
      </div>

      {/* Workspace selector */}
      <div className="px-3 py-3 border-b border-slate-800/60">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors group">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
            A
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Acme Corp</p>
            <p className="text-[10px] text-slate-500">Free trial · 12 days left</p>
          </div>
          <svg className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Main</p>
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2 mt-5">Workspace</p>
        {bottomItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-slate-800/60">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            JT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Jake Turner</p>
            <p className="text-[10px] text-slate-500 truncate">jake@acmecorp.io</p>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
