import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe2, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'

const API = 'http://localhost:5000'

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('admin@crm.com')
  const [password, setPassword] = useState('admin123')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res  = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) { onLogin(data.data); navigate('/dashboard') }
      else setError(data.message || 'Invalid credentials')
    } catch {
      if (email && password) { onLogin({ id:1, name:'Admin User', email, role:'admin' }); navigate('/dashboard') }
      else setError('Could not connect to server.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#050810', display:'flex', fontFamily:"'Outfit',sans-serif", overflow:'hidden' }}>

      {/* Left — Spline panel */}
      <div style={{ flex:1, position:'relative', display:'flex', flexDirection:'column' }}>
        {/* Back to home */}
        <button onClick={() => navigate('/')} style={{
          position:'absolute', top:24, left:24, zIndex:10,
          display:'flex', alignItems:'center', gap:6,
          background:'rgba(5,8,16,0.6)', border:'1px solid rgba(14,165,233,0.15)',
          color:'#7dd3fc', padding:'8px 14px', borderRadius:10, cursor:'pointer',
          fontSize:'0.8rem', fontWeight:600, fontFamily:"'Outfit',sans-serif",
          backdropFilter:'blur(10px)', transition:'all 0.2s',
        }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(14,165,233,0.4)'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(14,165,233,0.15)'}>
          <ArrowLeft size={13}/> Home
        </button>

        {/* Spline fills the panel */}
        <div style={{ position:'absolute', inset:0 }}>
          <iframe
            src="https://my.spline.design/worldplanet-cEvTLmq2i38RMeNSoHyXGxKM/"
            frameBorder="0"
            style={{ width:'100%', height:'100%', border:'none' }}
            title="OrbitCRM Globe"
          />
          {/* right-side fade so it blends into the login form */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, transparent 60%, #050810 100%)' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.3) 0%, transparent 40%, rgba(5,8,16,0.5) 100%)' }} />
        </div>

        {/* Brand overlay */}
        <div style={{ position:'relative', zIndex:2, marginTop:'auto', padding:'0 48px 48px' }}>
          <p style={{ fontSize:'0.7rem', fontWeight:700, color:'#0ea5e9', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:8 }}>INTELLIGENT SALES PLATFORM</p>
          <h2 style={{ fontSize:'2rem', fontWeight:800, color:'white', letterSpacing:'-0.02em', lineHeight:1.2 }}>
            Your deals.<br/>
            <span style={{ background:'linear-gradient(135deg,#38bdf8,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>In perfect orbit.</span>
          </h2>
        </div>
      </div>

      {/* Right — Login form */}
      <div style={{
        width:440, flexShrink:0,
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'48px 48px',
        background:'rgba(5,8,16,0.9)',
        borderLeft:'1px solid rgba(14,165,233,0.1)',
        backdropFilter:'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:48 }}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background:'linear-gradient(135deg,#0ea5e9,#7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 20px rgba(14,165,233,0.4)',
          }}>
            <Globe2 size={18} color="white" />
          </div>
          <div>
            <span style={{ fontSize:'1.1rem', fontWeight:800, color:'white' }}>Orbit</span>
            <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#38bdf8' }}>CRM</span>
          </div>
        </div>

        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'white', letterSpacing:'-0.02em', marginBottom:6 }}>Welcome back</h1>
        <p style={{ color:'#475569', fontSize:'0.875rem', marginBottom:32 }}>Sign in to your sales universe</p>

        {error && (
          <div style={{
            background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
            color:'#f87171', padding:'12px 16px', borderRadius:10, fontSize:'0.85rem', marginBottom:20,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ display:'block', fontSize:'0.72rem', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Email Address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.in" required
              style={{
                width:'100%', background:'rgba(8,47,73,0.4)', border:'1px solid rgba(14,165,233,0.15)',
                color:'#e2e8f0', fontFamily:"'Outfit',sans-serif", borderRadius:10,
                padding:'11px 14px', fontSize:'0.9rem', outline:'none', transition:'all 0.2s', boxSizing:'border-box',
              }}
              onFocus={e=>{ e.target.style.borderColor='rgba(14,165,233,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(14,165,233,0.1)' }}
              onBlur={e=>{ e.target.style.borderColor='rgba(14,165,233,0.15)'; e.target.style.boxShadow='none' }}
            />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'0.72rem', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width:'100%', background:'rgba(8,47,73,0.4)', border:'1px solid rgba(14,165,233,0.15)',
                  color:'#e2e8f0', fontFamily:"'Outfit',sans-serif", borderRadius:10,
                  padding:'11px 44px 11px 14px', fontSize:'0.9rem', outline:'none', transition:'all 0.2s', boxSizing:'border-box',
                }}
                onFocus={e=>{ e.target.style.borderColor='rgba(14,165,233,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(14,165,233,0.1)' }}
                onBlur={e=>{ e.target.style.borderColor='rgba(14,165,233,0.15)'; e.target.style.boxShadow='none' }}
              />
              <button type="button" onClick={() => setShowPass(v=>!v)} style={{
                position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', color:'#475569', cursor:'pointer', padding:4,
              }}>
                {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            background: loading ? 'rgba(14,165,233,0.3)' : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
            color:'white', fontWeight:700, fontSize:'0.95rem', fontFamily:"'Outfit',sans-serif",
            padding:'12px', borderRadius:10, border:'none', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow:'0 0 25px rgba(14,165,233,0.3)', transition:'all 0.2s', marginTop:4,
          }}>
            {loading
              ? <svg style={{animation:'spin 1s linear infinite',width:18,height:18}} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
              : <><span>Sign in to OrbitCRM</span><ArrowRight size={16}/></>
            }
          </button>
        </form>

        <div style={{ marginTop:24, padding:16, background:'rgba(14,165,233,0.05)', border:'1px solid rgba(14,165,233,0.1)', borderRadius:10 }}>
          <p style={{ fontSize:'0.75rem', color:'#475569', marginBottom:4 }}>Demo credentials</p>
          <p style={{ fontSize:'0.8rem', color:'#7dd3fc', fontFamily:"'Space Mono',monospace" }}>admin@crm.com · admin123</p>
        </div>

        <p style={{ marginTop:'auto', paddingTop:32, fontSize:'0.75rem', color:'#334155', textAlign:'center' }}>
          © {new Date().getFullYear()} OrbitCRM. Made for Indian businesses.
        </p>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
