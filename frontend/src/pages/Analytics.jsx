import{useEffect,useState}from 'react'
import{BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,PieChart,Pie,Cell}from 'recharts'
import{Loader2,TrendingUp,Users,DollarSign,Target,Phone,Mail,Calendar}from 'lucide-react'
import{apiFetch}from '../api'
import{inrShort}from '../utils/inr'

const STAGE_COLOR={'New Lead':'#64748b','Contacted':'#38bdf8','Demo':'#a78bfa','Negotiation':'#fbbf24','Won':'#34d399','Lost':'#f87171'}
const PIE_COLORS=['#0ea5e9','#34d399','#f59e0b']

const Tip=({active,payload,label})=>{
  if(!active||!payload?.length)return null
  return(
    <div style={{background:'rgba(5,8,16,0.95)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:10,padding:'10px 14px',fontSize:12}}>
      <p style={{color:'#64748b',marginBottom:4}}>{label}</p>
      {payload.map(p=><p key={p.name} style={{color:p.color,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{p.value}</p>)}
    </div>
  )
}

export default function Analytics(){
  const[data,setData]=useState(null)
  const[loading,setLoading]=useState(true)

  useEffect(()=>{apiFetch('/analytics').then(({ok,data})=>{if(ok)setData(data.data)}).finally(()=>setLoading(false))},[])

  if(loading)return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',gap:10,color:'#475569'}}>
      <Loader2 size={20} style={{animation:'spin 1s linear infinite'}}/>Loading analytics…
    </div>
  )
  if(!data)return<div style={{textAlign:'center',padding:64,color:'#475569'}}>Failed to load. Is the backend running?</div>

  const stageData=Object.entries(data.leads_by_stage||{}).map(([name,value])=>({name,value}))
  const actData=Object.entries(data.activities_breakdown||{}).map(([name,value])=>({name,value}))

  const kpis=[
    {label:'Total Leads',     value:data.total_leads,                  grad:'linear-gradient(135deg,#0ea5e9,#0284c7)',  glow:'rgba(14,165,233,0.3)',  icon:Users},
    {label:'Pipeline Value',  value:inrShort(data.total_pipeline_value),grad:'linear-gradient(135deg,#8b5cf6,#7c3aed)', glow:'rgba(139,92,246,0.3)', icon:DollarSign},
    {label:'Won Revenue',     value:inrShort(data.won_value),           grad:'linear-gradient(135deg,#10b981,#059669)',  glow:'rgba(16,185,129,0.3)', icon:TrendingUp},
    {label:'Win Rate',        value:`${data.conversion_rate_pct}%`,     grad:'linear-gradient(135deg,#f59e0b,#d97706)',  glow:'rgba(245,158,11,0.3)', icon:Target},
    {label:'Deals Won',       value:data.deals_won,                     grad:'linear-gradient(135deg,#34d399,#10b981)',  glow:'rgba(52,211,153,0.3)', icon:Target},
    {label:'Total Customers', value:data.total_customers,               grad:'linear-gradient(135deg,#38bdf8,#0ea5e9)',  glow:'rgba(56,189,248,0.3)', icon:Users},
  ]

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18,fontFamily:"'Outfit',sans-serif"}}>
      <div>
        <h1 style={{fontSize:'1.6rem',fontWeight:800,color:'white',letterSpacing:'-0.02em'}}>Analytics</h1>
        <p style={{fontSize:'0.82rem',color:'#475569',marginTop:2}}>Live metrics from your CRM database</p>
      </div>

      {/* KPI grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {kpis.map(({label,value,grad,glow,icon:Icon})=>(
          <div key={label} style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:20,transition:'all 0.3s'}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 24px ${glow}`;e.currentTarget.style.borderColor='rgba(14,165,233,0.2)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='rgba(14,165,233,0.1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <p style={{fontSize:'0.65rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</p>
              <div style={{width:30,height:30,borderRadius:8,background:grad,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 12px ${glow}`}}>
                <Icon size={13} color="white"/>
              </div>
            </div>
            <p style={{fontSize:'1.8rem',fontWeight:800,color:'white',letterSpacing:'-0.02em',fontFamily:"'Space Mono',monospace"}}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:20}}>
          <p style={{fontSize:'0.85rem',fontWeight:700,color:'white',marginBottom:4}}>Leads by Stage</p>
          <p style={{fontSize:'0.72rem',color:'#475569',marginBottom:16}}>Current distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} margin={{left:-20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.06)"/>
              <XAxis dataKey="name" tick={{fill:'#334155',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#334155',fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {stageData.map(e=><Cell key={e.name} fill={STAGE_COLOR[e.name]||'#38bdf8'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:20}}>
          <p style={{fontSize:'0.85rem',fontWeight:700,color:'white',marginBottom:4}}>Activity Types</p>
          <p style={{fontSize:'0.72rem',color:'#475569',marginBottom:16}}>Calls, emails, meetings</p>
          {actData.length>0?(
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={actData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {actData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:8}}>
                {actData.map(({name,value},i)=>(
                  <div key={name} style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.75rem'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:PIE_COLORS[i%PIE_COLORS.length]}}/>
                    <span style={{color:'#64748b',textTransform:'capitalize'}}>{name}</span>
                    <span style={{color:'#e2e8f0',fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{value}</span>
                  </div>
                ))}
              </div>
            </>
          ):<div style={{height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'#334155',fontSize:'0.85rem'}}>No activities logged yet</div>}
        </div>
      </div>

      {/* Funnel */}
      <div style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:20}}>
        <p style={{fontSize:'0.85rem',fontWeight:700,color:'white',marginBottom:16}}>Conversion Funnel</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {Object.entries(data.leads_by_stage||{}).map(([stage,count])=>{
            const pct=data.total_leads?Math.round((count/data.total_leads)*100):0
            return(
              <div key={stage} style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:100,fontSize:'0.72rem',color:'#64748b',textAlign:'right',flexShrink:0}}>{stage}</div>
                <div style={{flex:1,height:22,background:'rgba(14,165,233,0.06)',borderRadius:8,overflow:'hidden',position:'relative'}}>
                  <div style={{height:'100%',borderRadius:8,background:STAGE_COLOR[stage]||'#38bdf8',width:`${pct}%`,opacity:0.8,transition:'width 0.8s ease'}}/>
                  <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',fontSize:'0.7rem',color:'#94a3b8',fontFamily:"'Space Mono',monospace"}}>{count}</span>
                </div>
                <div style={{width:36,fontSize:'0.7rem',fontFamily:"'Space Mono',monospace",color:'#475569',flexShrink:0}}>{pct}%</div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
