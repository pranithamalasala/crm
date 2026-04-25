import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Users, DollarSign, Target, Loader2 } from 'lucide-react'
import { apiFetch } from '../api'
import { inrShort, inr } from '../utils/inr'

const STAGES = ['New Lead','Contacted','Demo','Negotiation','Won','Lost']
const STAGE_COLOR = { 'New Lead':'#64748b','Contacted':'#38bdf8','Demo':'#a78bfa','Negotiation':'#f59e0b','Won':'#34d399','Lost':'#f87171' }

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'rgba(5,8,16,0.95)', border:'1px solid rgba(14,165,233,0.2)', borderRadius:10, padding:'10px 14px', fontSize:12 }}>
      <p style={{ color:'#64748b', marginBottom:4 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color:p.color, fontFamily:"'Space Mono',monospace", fontWeight:700 }}>{p.name}: {inrShort(p.value)}</p>)}
    </div>
  )
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiFetch('/analytics'), apiFetch('/leads')])
      .then(([a, l]) => { if (a.ok) setAnalytics(a.data.data); if (l.ok) setLeads(l.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', gap:10, color:'#475569' }}>
      <Loader2 size={20} style={{ animation:'spin 1s linear infinite' }}/> Loading dashboard…
    </div>
  )

  const stats = analytics ? [
    { label:'Pipeline Value',  value: inrShort(analytics.total_pipeline_value), icon: DollarSign, glow:'rgba(14,165,233,0.3)',  grad:'linear-gradient(135deg,#0ea5e9,#0284c7)' },
    { label:'Active Leads',    value: analytics.total_leads,                     icon: Users,      glow:'rgba(139,92,246,0.3)',  grad:'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
    { label:'Won Revenue',     value: inrShort(analytics.won_value),             icon: TrendingUp, glow:'rgba(52,211,153,0.3)',  grad:'linear-gradient(135deg,#10b981,#059669)' },
    { label:'Win Rate',        value: `${analytics.conversion_rate_pct}%`,       icon: Target,     glow:'rgba(245,158,11,0.3)',  grad:'linear-gradient(135deg,#f59e0b,#d97706)' },
  ] : []

  const stageData = analytics ? Object.entries(analytics.leads_by_stage||{}).map(([s,c])=>({ stage:s, count:c })) : []

  // Build monthly chart from API or fallback
  const monthly = (analytics?.monthly_data || []).map(m => ({
    month: m.month?.slice(0,7) || '',
    revenue: m.value || 0,
    target: (m.value || 0) * 1.2,
  })).reverse()

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'white', letterSpacing:'-0.02em' }}>Dashboard</h1>
          <p style={{ color:'#475569', fontSize:'0.85rem', marginTop:2 }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
        </div>
        {analytics && <span style={{ fontSize:'0.78rem', color:'#34d399', fontWeight:600 }}>↑ {analytics.deals_won} deals won · {analytics.total_customers} customers</span>}
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {stats.map(({ label, value, icon: Icon, glow, grad }) => (
          <div key={label} style={{
            background:'rgba(8,47,73,0.2)', border:'1px solid rgba(14,165,233,0.1)',
            borderRadius:16, padding:20, transition:'all 0.3s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(14,165,233,0.25)'; e.currentTarget.style.boxShadow=`0 0 24px ${glow}` }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(14,165,233,0.1)'; e.currentTarget.style.boxShadow='none' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p style={{ fontSize:'0.68rem', fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</p>
              <div style={{ width:32, height:32, borderRadius:9, background:grad, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 12px ${glow}` }}>
                <Icon size={14} color="white"/>
              </div>
            </div>
            <p style={{ fontSize:'1.6rem', fontWeight:800, color:'white', letterSpacing:'-0.02em', fontFamily:"'Space Mono',monospace" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14 }}>
        {/* Revenue area chart */}
        <div style={{ background:'rgba(8,47,73,0.2)', border:'1px solid rgba(14,165,233,0.1)', borderRadius:16, padding:20 }}>
          <p style={{ fontSize:'0.85rem', fontWeight:700, color:'white', marginBottom:4 }}>Pipeline Value Over Time</p>
          <p style={{ fontSize:'0.72rem', color:'#475569', marginBottom:16 }}>Monthly deal value added</p>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthly} margin={{ left:-20, right:0, top:0, bottom:0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.06)"/>
                <XAxis dataKey="month" tick={{ fill:'#334155', fontSize:10 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#334155', fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={inrShort}/>
                <Tooltip content={<Tip/>}/>
                <Area dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#g1)" dot={false} name="Revenue"/>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center', color:'#334155', fontSize:'0.85rem' }}>Add more leads to see trends</div>
          )}
        </div>

        {/* Pipeline funnel */}
        <div style={{ background:'rgba(8,47,73,0.2)', border:'1px solid rgba(14,165,233,0.1)', borderRadius:16, padding:20 }}>
          <p style={{ fontSize:'0.85rem', fontWeight:700, color:'white', marginBottom:4 }}>Pipeline Stages</p>
          <p style={{ fontSize:'0.72rem', color:'#475569', marginBottom:16 }}>Live from database</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {stageData.filter(d=>d.count>0).map(d => {
              const pct = analytics?.total_leads ? Math.round((d.count/analytics.total_leads)*100) : 0
              return (
                <div key={d.stage}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:'0.72rem', color:'#64748b' }}>{d.stage}</span>
                    <span style={{ fontSize:'0.72rem', color:'#e2e8f0', fontFamily:"'Space Mono',monospace" }}>{d.count}</span>
                  </div>
                  <div style={{ height:5, background:'rgba(14,165,233,0.08)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:99, background:STAGE_COLOR[d.stage]||'#38bdf8', width:`${pct}%`, transition:'width 0.8s ease' }}/>
                  </div>
                </div>
              )
            })}
          </div>
          {analytics && (
            <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid rgba(14,165,233,0.08)' }}>
              <p style={{ fontSize:'0.68rem', color:'#475569' }}>Win Rate</p>
              <p style={{ fontSize:'1.4rem', fontWeight:800, color:'#34d399', fontFamily:"'Space Mono',monospace" }}>{analytics.conversion_rate_pct}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent leads table */}
      <div style={{ background:'rgba(8,47,73,0.2)', border:'1px solid rgba(14,165,233,0.1)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(14,165,233,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:'0.85rem', fontWeight:700, color:'white' }}>Recent Leads</p>
          <a href="/leads" style={{ fontSize:'0.72rem', color:'#38bdf8', textDecoration:'none', fontWeight:600 }}>View all →</a>
        </div>
        {leads.slice(0,5).map((l,i) => (
          <div key={l.id} style={{
            display:'flex', alignItems:'center', gap:14, padding:'12px 20px',
            borderBottom: i<4 ? '1px solid rgba(14,165,233,0.05)' : 'none',
            transition:'background 0.15s',
          }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.04)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,rgba(14,165,233,0.3),rgba(139,92,246,0.3))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, color:'white', flexShrink:0 }}>
              {l.name?.split(' ').map(n=>n[0]).join('')}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:'0.83rem', fontWeight:600, color:'#e2e8f0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{l.name}</p>
              <p style={{ fontSize:'0.7rem', color:'#475569' }}>{l.company||l.email}</p>
            </div>
            <span style={{ fontSize:'0.72rem', fontFamily:"'Space Mono',monospace", color:'#7dd3fc', fontWeight:700 }}>{inrShort(l.value)}</span>
            <span style={{ fontSize:'0.65rem', padding:'2px 8px', borderRadius:99, background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', color:'#38bdf8', fontWeight:600, whiteSpace:'nowrap' }}>{l.status}</span>
          </div>
        ))}
        {leads.length===0 && <p style={{ textAlign:'center', padding:32, color:'#334155', fontSize:'0.85rem' }}>No leads yet — add some!</p>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
