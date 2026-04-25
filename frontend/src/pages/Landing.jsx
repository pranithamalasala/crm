import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, Globe2, Zap, BarChart3, Users, Shield, ChevronDown } from 'lucide-react'

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  dur: 2 + Math.random() * 3,
}))

export default function Landing() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const features = [
    { icon: Globe2,    title: 'Visual Pipeline',  desc: 'Drag deals across your cosmic pipeline. Every stage is a new orbit.' },
    { icon: BarChart3, title: 'Live Analytics',   desc: 'Real-time charts powered by your actual CRM data. No guesswork.' },
    { icon: Users,     title: 'Lead Intelligence', desc: 'Score, track and convert leads with an intelligent scoring engine.' },
    { icon: Zap,       title: 'Instant Actions',  desc: 'Log calls, emails and meetings in seconds — right from the timeline.' },
    { icon: Shield,    title: 'Secure by Default', desc: 'bcrypt auth, role-based access, and data stored locally on your machine.' },
    { icon: BarChart3, title: '₹ INR Native',     desc: 'Built for Indian businesses. Every rupee tracked, every deal counted.' },
  ]

  return (
    <div style={{ background: '#050810', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Stars background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {STARS.map(s => (
          <div key={s.id} style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size, borderRadius: '50%',
            background: 'white', opacity: 0.6,
            animation: `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }} />
        ))}
        {/* Glow blobs */}
        <div style={{ position:'absolute', top:'10%', left:'15%', width:500, height:500, borderRadius:'50%', background:'rgba(14,165,233,0.08)', filter:'blur(100px)' }} />
        <div style={{ position:'absolute', bottom:'20%', right:'10%', width:400, height:400, borderRadius:'50%', background:'rgba(139,92,246,0.07)', filter:'blur(100px)' }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px',
        background: scrollY > 20 ? 'rgba(5,8,16,0.85)' : 'transparent',
        backdropFilter: scrollY > 20 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 20 ? '1px solid rgba(14,165,233,0.1)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: '0 0 20px rgba(14,165,233,0.4)',
          }}>
            <Globe2 size={18} color="white" />
          </div>
          <div>
            <span style={{ fontSize:'1.1rem', fontWeight:800, color:'white', letterSpacing:'-0.02em' }}>Orbit</span>
            <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#38bdf8', letterSpacing:'-0.02em' }}>CRM</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => navigate('/login')} style={{
            background:'rgba(14,165,233,0.1)', color:'#7dd3fc', border:'1px solid rgba(14,165,233,0.2)',
            padding:'8px 20px', borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:'0.85rem',
            fontFamily:"'Outfit',sans-serif", transition:'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.background='rgba(14,165,233,0.2)'; e.target.style.color='#bae6fd' }}
            onMouseLeave={e => { e.target.style.background='rgba(14,165,233,0.1)'; e.target.style.color='#7dd3fc' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/login')} style={{
            background:'linear-gradient(135deg,#0ea5e9,#0284c7)', color:'white',
            padding:'8px 20px', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:'0.85rem',
            border:'none', fontFamily:"'Outfit',sans-serif", boxShadow:'0 0 20px rgba(14,165,233,0.3)',
            transition:'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.boxShadow='0 0 35px rgba(14,165,233,0.5)'; e.target.style.transform='translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.boxShadow='0 0 20px rgba(14,165,233,0.3)'; e.target.style.transform='translateY(0)' }}>
            Launch App →
          </button>
        </div>
      </nav>

      {/* ── Hero with Spline ── */}
      <section style={{ position:'relative', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:1 }}>

        {/* Spline 3D planet — full section background */}
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <iframe
            src="https://my.spline.design/worldplanet-cEvTLmq2i38RMeNSoHyXGxKM/"
            frameBorder="0"
            style={{ width:'100%', height:'100%', border:'none' }}
            title="OrbitCRM 3D Globe"
          />
          {/* Overlay so text is readable */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.3) 0%, rgba(5,8,16,0.1) 40%, rgba(5,8,16,0.7) 100%)' }} />
        </div>

        {/* Hero text — positioned top/center */}
        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 24px', marginTop:'-10vh' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.25)',
            padding:'6px 16px', borderRadius:99, marginBottom:24,
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#38bdf8', display:'inline-block', animation:'pulseRing 2s ease-out infinite' }} />
            <span style={{ fontSize:'0.75rem', fontWeight:600, color:'#7dd3fc', letterSpacing:'0.08em', textTransform:'uppercase' }}>
              The CRM Built for Indian Sales Teams
            </span>
          </div>

          <h1 style={{
            fontSize:'clamp(2.8rem,7vw,5.5rem)', fontWeight:900, lineHeight:1.05,
            letterSpacing:'-0.03em', color:'white', marginBottom:20,
          }}>
            Your Sales Universe,<br />
            <span style={{ background:'linear-gradient(135deg,#38bdf8,#7dd3fc,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              In Perfect Orbit.
            </span>
          </h1>

          <p style={{ fontSize:'1.15rem', color:'#94a3b8', maxWidth:520, margin:'0 auto 36px', lineHeight:1.65, fontWeight:400 }}>
            Track leads, close deals, and grow revenue — all in one beautifully crafted CRM designed for ambitious Indian businesses.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => navigate('/login')} style={{
              display:'flex', alignItems:'center', gap:8,
              background:'linear-gradient(135deg,#0ea5e9,#0284c7)',
              color:'white', fontWeight:700, fontSize:'1rem', fontFamily:"'Outfit',sans-serif",
              padding:'14px 32px', borderRadius:12, border:'none', cursor:'pointer',
              boxShadow:'0 0 30px rgba(14,165,233,0.5)', transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 50px rgba(14,165,233,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 0 30px rgba(14,165,233,0.5)' }}>
              Start for Free <ArrowRight size={18} />
            </button>
            <button onClick={() => document.getElementById('features').scrollIntoView({ behavior:'smooth' })} style={{
              display:'flex', alignItems:'center', gap:8,
              background:'rgba(255,255,255,0.05)', color:'#cbd5e1',
              fontWeight:600, fontSize:'1rem', fontFamily:"'Outfit',sans-serif",
              padding:'14px 32px', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)',
              cursor:'pointer', transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='white' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#cbd5e1' }}>
              Explore Features
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display:'flex', gap:32, justifyContent:'center', marginTop:48, flexWrap:'wrap' }}>
            {[['₹2.4Cr+', 'Pipeline Tracked'], ['1,200+', 'Leads Managed'], ['98%', 'Uptime'], ['0', 'Setup Cost']].map(([v, l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem', fontWeight:800, color:'#38bdf8' }}>{v}</div>
                <div style={{ fontSize:'0.72rem', color:'#64748b', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', zIndex:2, animation:'float 3s ease-in-out infinite' }}>
          <ChevronDown size={22} color="#38bdf8" style={{ opacity:0.6 }} />
        </div>
      </section>

      {/* ── Features section ── */}
      <section id="features" style={{ position:'relative', zIndex:1, padding:'100px 48px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#0ea5e9', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>WHAT'S INSIDE</p>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:800, color:'white', letterSpacing:'-0.02em', lineHeight:1.1 }}>
            Everything your sales team needs,<br />
            <span style={{ color:'#38bdf8' }}>nothing it doesn't.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:20 }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} style={{
              background:'rgba(8,47,73,0.2)', border:'1px solid rgba(14,165,233,0.1)',
              borderRadius:16, padding:28, transition:'all 0.3s',
              animation:`slideUp 0.5s ${i*0.08}s cubic-bezier(0.16,1,0.3,1) both`,
              cursor:'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(14,165,233,0.3)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(14,165,233,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(14,165,233,0.1)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{
                width:44, height:44, borderRadius:12, marginBottom:16,
                background:'linear-gradient(135deg,rgba(14,165,233,0.2),rgba(139,92,246,0.15))',
                border:'1px solid rgba(14,165,233,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon size={20} color="#38bdf8" />
              </div>
              <h3 style={{ fontWeight:700, fontSize:'1rem', color:'white', marginBottom:8 }}>{title}</h3>
              <p style={{ fontSize:'0.875rem', color:'#64748b', lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA section ── */}
      <section style={{
        position:'relative', zIndex:1, margin:'0 48px 80px',
        background:'linear-gradient(135deg,rgba(14,165,233,0.12),rgba(139,92,246,0.08))',
        border:'1px solid rgba(14,165,233,0.2)', borderRadius:24,
        padding:'64px 48px', textAlign:'center', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:400, height:400, borderRadius:'50%', background:'rgba(14,165,233,0.05)', filter:'blur(60px)', pointerEvents:'none' }} />
        <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#0ea5e9', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:16 }}>GET STARTED TODAY</p>
        <h2 style={{ fontSize:'clamp(1.6rem,4vw,2.8rem)', fontWeight:800, color:'white', letterSpacing:'-0.02em', marginBottom:16 }}>
          Ready to put your sales in orbit?
        </h2>
        <p style={{ color:'#64748b', fontSize:'1rem', marginBottom:36 }}>No XAMPP. No MySQL. No credit card. Just run and go.</p>
        <button onClick={() => navigate('/login')} style={{
          display:'inline-flex', alignItems:'center', gap:10,
          background:'linear-gradient(135deg,#0ea5e9,#0284c7)',
          color:'white', fontWeight:700, fontSize:'1rem', fontFamily:"'Outfit',sans-serif",
          padding:'14px 40px', borderRadius:12, border:'none', cursor:'pointer',
          boxShadow:'0 0 40px rgba(14,165,233,0.4)', transition:'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 60px rgba(14,165,233,0.6)' }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 0 40px rgba(14,165,233,0.4)' }}>
          Launch OrbitCRM <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ textAlign:'center', padding:'24px 48px', borderTop:'1px solid rgba(14,165,233,0.08)', color:'#334155', fontSize:'0.8rem', position:'relative', zIndex:1 }}>
        OrbitCRM — Built for Indian Sales Teams · {new Date().getFullYear()}
      </footer>

      <style>{`
        @keyframes starTwinkle { 0%,100%{opacity:0.2} 50%{opacity:0.9} }
        @keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-8px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2);opacity:0} }
      `}</style>
    </div>
  )
}
