import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, GitBranch, BarChart3, UserCheck, LogOut, Globe2, Settings } from 'lucide-react'

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Users,           label: 'Leads',     to: '/leads' },
  { icon: GitBranch,       label: 'Pipeline',  to: '/pipeline' },
  { icon: UserCheck,       label: 'Customers', to: '/customers' },
  { icon: BarChart3,       label: 'Analytics', to: '/analytics' },
]

export default function Sidebar({ onLogout, user }) {
  const navigate = useNavigate()
  return (
    <aside style={{
      width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: 'rgba(5,8,16,0.95)', borderRight: '1px solid rgba(14,165,233,0.08)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(14,165,233,0.08)', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width:32, height:32, borderRadius:8,
          background:'linear-gradient(135deg,#0ea5e9,#7c3aed)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 16px rgba(14,165,233,0.4)', flexShrink:0,
        }}>
          <Globe2 size={15} color="white"/>
        </div>
        <div>
          <span style={{fontSize:'0.95rem',fontWeight:800,color:'white'}}>Orbit</span>
          <span style={{fontSize:'0.95rem',fontWeight:800,color:'#38bdf8'}}>CRM</span>
        </div>
        <div style={{
          marginLeft:'auto', fontSize:'0.6rem', fontFamily:"'Space Mono',monospace",
          background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)',
          color:'#38bdf8', padding:'2px 6px', borderRadius:4,
        }}>v2</div>
      </div>

      {/* User */}
      <div style={{ padding: '12px 12px', borderBottom: '1px solid rgba(14,165,233,0.06)' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
          background:'rgba(14,165,233,0.06)', borderRadius:10, border:'1px solid rgba(14,165,233,0.08)',
        }}>
          <div style={{
            width:28, height:28, borderRadius:8, flexShrink:0,
            background:'linear-gradient(135deg,#7c3aed,#0ea5e9)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'0.7rem', fontWeight:800, color:'white',
          }}>
            {user?.name?.split(' ').map(n=>n[0]).join('') || 'AU'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'#e2e8f0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name || 'Admin'}</p>
            <p style={{ fontSize:'0.65rem', color:'#475569', textTransform:'capitalize' }}>{user?.role || 'admin'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        <p style={{ fontSize:'0.6rem', fontWeight:700, color:'#334155', textTransform:'uppercase', letterSpacing:'0.1em', padding:'4px 10px 8px' }}>Navigation</p>
        {nav.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10,
            color: isActive ? '#38bdf8' : '#475569', fontWeight:600, fontSize:'0.85rem',
            background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent',
            border: isActive ? '1px solid rgba(14,165,233,0.2)' : '1px solid transparent',
            textDecoration:'none', transition:'all 0.15s', cursor:'pointer',
          })}
            onMouseEnter={e=>{ if(!e.currentTarget.style.background.includes('0.12')) { e.currentTarget.style.color='#7dd3fc'; e.currentTarget.style.background='rgba(14,165,233,0.06)' }}}
            onMouseLeave={e=>{ if(!e.currentTarget.style.background.includes('0.12')) { e.currentTarget.style.color='#475569'; e.currentTarget.style.background='transparent' }}}
          >
            <Icon size={15}/> {label}
          </NavLink>
        ))}

        <p style={{ fontSize:'0.6rem', fontWeight:700, color:'#334155', textTransform:'uppercase', letterSpacing:'0.1em', padding:'12px 10px 8px', marginTop:8 }}>Workspace</p>
        <NavLink to="/settings" style={({ isActive }) => ({
          display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10,
          color: isActive ? '#38bdf8' : '#475569', fontWeight:600, fontSize:'0.85rem',
          background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent',
          border: isActive ? '1px solid rgba(14,165,233,0.2)' : '1px solid transparent',
          textDecoration:'none', transition:'all 0.15s',
        })}>
          <Settings size={15}/> Settings
        </NavLink>
      </nav>

      {/* Logout */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid rgba(14,165,233,0.06)' }}>
        <button onClick={onLogout} style={{
          width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10,
          color:'#ef4444', background:'transparent', border:'1px solid transparent',
          cursor:'pointer', fontWeight:600, fontSize:'0.85rem', fontFamily:"'Outfit',sans-serif",
          transition:'all 0.15s', textAlign:'left',
        }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.2)' }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}>
          <LogOut size={15}/> Sign Out
        </button>
      </div>
    </aside>
  )
}
