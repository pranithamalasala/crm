import { Bell, Search, Globe2 } from 'lucide-react'

export default function Navbar({ user }) {
  return (
    <header style={{
      height: 56, flexShrink: 0, display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      background: 'rgba(5,8,16,0.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(14,165,233,0.08)',
    }}>
      <div style={{ position:'relative', flex:1, maxWidth:320 }}>
        <Search size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#334155' }}/>
        <input placeholder="Search anything…" style={{
          width:'100%', background:'rgba(8,47,73,0.3)', border:'1px solid rgba(14,165,233,0.1)',
          color:'#e2e8f0', fontFamily:"'Outfit',sans-serif", borderRadius:10,
          padding:'7px 12px 7px 34px', fontSize:'0.8rem', outline:'none', boxSizing:'border-box',
        }}
          onFocus={e=>{ e.target.style.borderColor='rgba(14,165,233,0.3)'; e.target.style.background='rgba(8,47,73,0.5)' }}
          onBlur={e=>{ e.target.style.borderColor='rgba(14,165,233,0.1)'; e.target.style.background='rgba(8,47,73,0.3)' }}
        />
      </div>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
        <button style={{
          width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.1)',
          borderRadius:10, cursor:'pointer', color:'#475569', position:'relative',
          transition:'all 0.2s',
        }}
          onMouseEnter={e=>{ e.currentTarget.style.color='#38bdf8'; e.currentTarget.style.borderColor='rgba(14,165,233,0.3)' }}
          onMouseLeave={e=>{ e.currentTarget.style.color='#475569'; e.currentTarget.style.borderColor='rgba(14,165,233,0.1)' }}>
          <Bell size={14}/>
          <span style={{ position:'absolute', top:8, right:8, width:6, height:6, borderRadius:'50%', background:'#0ea5e9', border:'1px solid #050810' }}/>
        </button>
        <div style={{
          width:30, height:30, borderRadius:8,
          background:'linear-gradient(135deg,#7c3aed,#0ea5e9)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'0.65rem', fontWeight:800, color:'white', cursor:'pointer',
          boxShadow:'0 0 12px rgba(14,165,233,0.3)',
        }}>
          {user?.name?.split(' ').map(n=>n[0]).join('') || 'AU'}
        </div>
      </div>
    </header>
  )
}
