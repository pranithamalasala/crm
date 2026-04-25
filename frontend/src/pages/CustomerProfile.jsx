import{useParams,useNavigate}from 'react-router-dom'
import{useEffect,useState}from 'react'
import{ArrowLeft,Mail,Phone,Building2,Calendar,PhoneCall,Loader2,Plus,Star}from 'lucide-react'
import{apiFetch}from '../api'
import{inrShort}from '../utils/inr'

const ACT_ICON={call:PhoneCall,email:Mail,meeting:Calendar}
const ACT_COLOR={call:'rgba(56,189,248,0.12)|#38bdf8|rgba(56,189,248,0.2)',email:'rgba(167,139,250,0.12)|#a78bfa|rgba(167,139,250,0.2)',meeting:'rgba(251,191,36,0.12)|#fbbf24|rgba(251,191,36,0.2)'}
const sc=(t)=>{ const[bg,col,brd]=(ACT_COLOR[t]||ACT_COLOR.email).split('|'); return{background:bg,color:col,border:`1px solid ${brd}`} }

const STATUS_COLOR={'New Lead':'#64748b','Contacted':'#38bdf8','Demo':'#a78bfa','Negotiation':'#fbbf24','Won':'#34d399','Lost':'#f87171'}

export default function CustomerProfile(){
  const{id}=useParams(); const navigate=useNavigate()
  const[lead,setLead]=useState(null)
  const[activities,setActivities]=useState([])
  const[loading,setLoading]=useState(true)
  const[logType,setLogType]=useState('call')
  const[logNote,setLogNote]=useState('')
  const[logging,setLogging]=useState(false)

  useEffect(()=>{
    Promise.all([apiFetch(`/leads/${id}`),apiFetch(`/activities?lead_id=${id}`)])
      .then(([l,a])=>{ if(l.ok)setLead(l.data.data); if(a.ok)setActivities(a.data.data||[]) })
      .finally(()=>setLoading(false))
  },[id])

  const logActivity=async()=>{
    setLogging(true)
    try{
      const{ok,data}=await apiFetch('/activities',{method:'POST',body:JSON.stringify({lead_id:Number(id),user_id:1,type:logType,notes:logNote})})
      if(ok){setActivities(p=>[{activity_id:data.data?.activity_id,type:logType,notes:logNote,date:new Date().toISOString(),user_name:'You'},...p]);setLogNote('')}
    }finally{setLogging(false)}
  }

  if(loading)return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',gap:10,color:'#475569'}}><Loader2 size={20} style={{animation:'spin 1s linear infinite'}}/>Loading…</div>)
  if(!lead)return(<div style={{textAlign:'center',padding:64}}><p style={{color:'#475569',marginBottom:16}}>Profile not found</p><button onClick={()=>navigate(-1)} style={{background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',color:'#38bdf8',padding:'8px 16px',borderRadius:10,cursor:'pointer',fontFamily:"'Outfit',sans-serif",fontWeight:600}}>← Go back</button></div>)

  const statusColor=STATUS_COLOR[lead.status]||'#64748b'

  return(
    <div style={{display:'flex',flexDirection:'column',gap:16,maxWidth:960,fontFamily:"'Outfit',sans-serif"}}>
      <button onClick={()=>navigate(-1)} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:'0.82rem',fontFamily:"'Outfit',sans-serif",fontWeight:600,width:'fit-content',transition:'color 0.15s'}}
        onMouseEnter={e=>e.currentTarget.style.color='#7dd3fc'}
        onMouseLeave={e=>e.currentTarget.style.color='#475569'}>
        <ArrowLeft size={14}/> Back
      </button>

      {/* Hero card */}
      <div style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.12)',borderRadius:20,padding:24,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'rgba(14,165,233,0.04)',filter:'blur(40px)',pointerEvents:'none'}}/>
        <div style={{display:'flex',alignItems:'flex-start',gap:16}}>
          <div style={{position:'relative',flexShrink:0}}>
            <div style={{width:60,height:60,borderRadius:16,background:'linear-gradient(135deg,#0ea5e9,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',fontWeight:800,color:'white',boxShadow:'0 0 24px rgba(14,165,233,0.4)'}}>
              {lead.name?.split(' ').map(n=>n[0]).join('')}
            </div>
            <div style={{position:'absolute',bottom:-2,right:-2,width:14,height:14,borderRadius:'50%',background:'#34d399',border:'2px solid #050810'}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
              <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'white',letterSpacing:'-0.02em'}}>{lead.name}</h1>
              <Star size={14} color="#334155" style={{cursor:'pointer'}}/>
              <span style={{fontSize:'0.65rem',fontWeight:700,padding:'2px 8px',borderRadius:99,background:`${statusColor}20`,color:statusColor,border:`1px solid ${statusColor}35`,marginLeft:'auto'}}>{lead.status}</span>
            </div>
            <p style={{fontSize:'0.82rem',color:'#475569'}}>{lead.company||'No company'} · {lead.email}</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop:16,paddingTop:16,borderTop:'1px solid rgba(14,165,233,0.08)'}}>
              {[[Mail,'Email',lead.email],[Phone,'Phone',lead.phone||'N/A'],[Building2,'Company',lead.company||'N/A'],[Calendar,'Added',lead.created_at?.slice(0,10)||'N/A']].map(([Icon,label,value])=>(
                <div key={label}>
                  <p style={{fontSize:'0.62rem',color:'#475569',display:'flex',alignItems:'center',gap:4,marginBottom:3}}><Icon size={10}/>{label}</p>
                  <p style={{fontSize:'0.8rem',color:'#e2e8f0',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3-col grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
        {/* Deal info */}
        <div style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:18}}>
          <p style={{fontSize:'0.78rem',fontWeight:700,color:'white',marginBottom:14}}>Deal Overview</p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[['Deal Value',inrShort(lead.value)],['Status',lead.status],['Source',lead.source||'N/A'],['Assigned To',lead.assigned_user||'N/A']].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(14,165,233,0.05)',paddingBottom:8}}>
                <span style={{fontSize:'0.72rem',color:'#475569'}}>{k}</span>
                <span style={{fontSize:'0.78rem',color:'#e2e8f0',fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid rgba(14,165,233,0.08)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:'0.68rem',color:'#475569'}}>Lead Score</span>
              <span style={{fontSize:'0.72rem',fontFamily:"'Space Mono',monospace",color:'#e2e8f0'}}>{lead.score||0}/100</span>
            </div>
            <div style={{height:5,background:'rgba(14,165,233,0.08)',borderRadius:99,overflow:'hidden'}}>
              <div style={{height:'100%',borderRadius:99,background:(lead.score||0)>=80?'#34d399':(lead.score||0)>=60?'#fbbf24':'#64748b',width:`${lead.score||0}%`,transition:'width 0.8s'}}/>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:18,display:'flex',flexDirection:'column'}}>
          <p style={{fontSize:'0.78rem',fontWeight:700,color:'white',marginBottom:12}}>Notes</p>
          <textarea placeholder="Add a note about this lead…" rows={6} style={{flex:1,background:'rgba(8,47,73,0.3)',border:'1px solid rgba(14,165,233,0.12)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:10,padding:'10px 12px',fontSize:'0.82rem',outline:'none',resize:'none',boxSizing:'border-box'}}
            onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.35)'}
            onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.12)'}/>
          <button style={{marginTop:10,padding:'8px',background:'linear-gradient(135deg,#0ea5e9,#0284c7)',border:'none',color:'white',borderRadius:9,cursor:'pointer',fontWeight:600,fontSize:'0.78rem',fontFamily:"'Outfit',sans-serif"}}>Save Note</button>
        </div>

        {/* Activities */}
        <div style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:18,display:'flex',flexDirection:'column'}}>
          <p style={{fontSize:'0.78rem',fontWeight:700,color:'white',marginBottom:12}}>Activity Timeline</p>
          <div style={{background:'rgba(8,47,73,0.3)',border:'1px solid rgba(14,165,233,0.08)',borderRadius:10,padding:10,marginBottom:12}}>
            <div style={{display:'flex',gap:6,marginBottom:8}}>
              {['call','email','meeting'].map(t=>(
                <button key={t} onClick={()=>setLogType(t)} style={{flex:1,padding:'5px',borderRadius:7,background:logType===t?'linear-gradient(135deg,#0ea5e9,#0284c7)':'rgba(14,165,233,0.06)',border:logType===t?'none':'1px solid rgba(14,165,233,0.1)',color:logType===t?'white':'#475569',cursor:'pointer',fontSize:'0.7rem',fontFamily:"'Outfit',sans-serif",fontWeight:600,textTransform:'capitalize',transition:'all 0.15s'}}>
                  {t}
                </button>
              ))}
            </div>
            <input value={logNote} onChange={e=>setLogNote(e.target.value)} placeholder="Notes (optional)"
              style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.12)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:8,padding:'7px 10px',fontSize:'0.78rem',outline:'none',boxSizing:'border-box',marginBottom:8}}/>
            <button onClick={logActivity} disabled={logging} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'7px',background:'linear-gradient(135deg,#0ea5e9,#0284c7)',border:'none',color:'white',borderRadius:8,cursor:logging?'not-allowed':'pointer',fontWeight:600,fontSize:'0.75rem',fontFamily:"'Outfit',sans-serif",opacity:logging?0.7:1}}>
              {logging?<><Loader2 size={11} style={{animation:'spin 1s linear infinite'}}/>Logging…</>:<><Plus size={11}/>Log Activity</>}
            </button>
          </div>
          <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:8}}>
            {activities.length===0&&<p style={{fontSize:'0.75rem',color:'#334155',textAlign:'center',padding:16}}>No activities yet</p>}
            {activities.map((a,i)=>{
              const Icon=ACT_ICON[a.type]||Mail
              const s=sc(a.type)
              return(
                <div key={a.activity_id||i} style={{display:'flex',alignItems:'flex-start',gap:10}}>
                  <div style={{width:28,height:28,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,...s}}>
                    <Icon size={12}/>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'0.75rem',color:'#e2e8f0',fontWeight:600,textTransform:'capitalize'}}>{a.type}</p>
                    {a.notes&&<p style={{fontSize:'0.7rem',color:'#475569',marginTop:1}}>{a.notes}</p>}
                    <p style={{fontSize:'0.65rem',color:'#334155',marginTop:1}}>{a.date?.slice(0,10)||'Today'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
