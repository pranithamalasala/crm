import { useState, useEffect, useCallback } from 'react'
import { Loader2, ChevronRight } from 'lucide-react'
import { apiFetch } from '../api'
import { inrShort } from '../utils/inr'

const STAGES=['New Lead','Contacted','Demo','Negotiation','Won','Lost']
const SC={
  'New Lead':    {dot:'#64748b',bar:'rgba(100,116,139,0.15)',badge:'rgba(100,116,139,0.12)|#94a3b8|rgba(100,116,139,0.2)'},
  'Contacted':   {dot:'#38bdf8',bar:'rgba(56,189,248,0.15)',badge:'rgba(56,189,248,0.12)|#38bdf8|rgba(56,189,248,0.2)'},
  'Demo':        {dot:'#a78bfa',bar:'rgba(167,139,250,0.15)',badge:'rgba(167,139,250,0.12)|#a78bfa|rgba(167,139,250,0.2)'},
  'Negotiation': {dot:'#fbbf24',bar:'rgba(245,158,11,0.15)',badge:'rgba(245,158,11,0.12)|#fbbf24|rgba(245,158,11,0.2)'},
  'Won':         {dot:'#34d399',bar:'rgba(52,211,153,0.15)',badge:'rgba(52,211,153,0.12)|#34d399|rgba(52,211,153,0.2)'},
  'Lost':        {dot:'#f87171',bar:'rgba(248,113,113,0.15)',badge:'rgba(248,113,113,0.12)|#f87171|rgba(248,113,113,0.2)'},
}
const badge=(s)=>{ const [bg,col,brd]=(SC[s]?.badge||SC['New Lead'].badge).split('|'); return {background:bg,color:col,border:`1px solid ${brd}`} }

function Card({lead,onMove}){
  const [moving,setMoving]=useState(false)
  const isTerminal=lead.status==='Won'||lead.status==='Lost'
  const advance=async(e)=>{
    e.stopPropagation(); setMoving(true)
    try{const{ok,data}=await apiFetch('/pipeline/move',{method:'POST',body:JSON.stringify({lead_id:lead.id})}); if(ok) onMove(lead.id,data.data.new_stage)}
    finally{setMoving(false)}
  }
  return (
    <div style={{background:'rgba(8,47,73,0.25)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:14,padding:14,transition:'all 0.2s',cursor:'default'}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(14,165,233,0.25)';e.currentTarget.style.boxShadow='0 8px 24px rgba(14,165,233,0.08)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(14,165,233,0.1)';e.currentTarget.style.boxShadow='none'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
        <p style={{fontSize:'0.83rem',fontWeight:700,color:'#e2e8f0',lineHeight:1.3,flex:1,paddingRight:8}}>{lead.name}</p>
        {!isTerminal && (
          <button onClick={advance} disabled={moving} title="Advance stage"
            style={{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:6,color:'#38bdf8',cursor:'pointer',flexShrink:0,transition:'all 0.15s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(14,165,233,0.2)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(14,165,233,0.1)'}}>
            {moving?<Loader2 size={11} style={{animation:'spin 1s linear infinite'}}/>:<ChevronRight size={11}/>}
          </button>
        )}
      </div>
      <p style={{fontSize:'0.72rem',color:'#475569',marginBottom:10}}>{lead.company||lead.email}</p>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <span style={{fontSize:'0.9rem',fontWeight:800,color:'#7dd3fc',fontFamily:"'Space Mono',monospace"}}>{inrShort(lead.value)}</span>
        <span style={{fontSize:'0.62rem',fontWeight:700,padding:'2px 7px',borderRadius:99,...badge(lead.status)}}>{lead.score||0}</span>
      </div>
      <div style={{height:3,background:'rgba(14,165,233,0.08)',borderRadius:99,overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:99,background:SC[lead.status]?.dot||'#38bdf8',width:`${lead.score||0}%`,opacity:0.8,transition:'width 0.6s'}}/>
      </div>
    </div>
  )
}

export default function Pipeline(){
  const [board,setBoard]=useState({})
  const [loading,setLoading]=useState(true)

  const load=useCallback(async()=>{
    setLoading(true)
    try{const{ok,data}=await apiFetch('/pipeline/board'); if(ok)setBoard(data.data||{})}
    finally{setLoading(false)}
  },[])

  useEffect(()=>{load()},[load])

  const handleMove=(id,newStage)=>{
    setBoard(prev=>{
      const next={};
      STAGES.forEach(s=>{next[s]=(prev[s]||[]).filter(l=>l.id!==id)})
      const lead=Object.values(prev).flat().find(l=>l.id===id)
      if(lead) next[newStage]=[...next[newStage],{...lead,status:newStage}]
      return next
    })
  }

  const allLeads=Object.values(board).flat()
  const totalVal=allLeads.reduce((s,l)=>s+(l.value||0),0)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,height:'100%',fontFamily:"'Outfit',sans-serif"}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexShrink:0}}>
        <div>
          <h1 style={{fontSize:'1.6rem',fontWeight:800,color:'white',letterSpacing:'-0.02em'}}>Pipeline</h1>
          <p style={{fontSize:'0.82rem',color:'#475569',marginTop:2}}>{allLeads.length} deals · {inrShort(totalVal)}</p>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.08)',borderRadius:14,overflow:'hidden',flexShrink:0}}>
        {STAGES.map((s,i)=>{
          const ls=board[s]||[]; const val=ls.reduce((a,l)=>a+(l.value||0),0)
          return (
            <div key={s} style={{textAlign:'center',padding:'12px 8px',borderRight:i<5?'1px solid rgba(14,165,233,0.08)':'none'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,marginBottom:4}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:SC[s]?.dot||'#64748b'}}/>
                <p style={{fontSize:'0.62rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s}</p>
              </div>
              <p style={{fontSize:'0.9rem',fontWeight:800,color:SC[s]?.dot||'#64748b',fontFamily:"'Space Mono',monospace"}}>{inrShort(val)}</p>
              <p style={{fontSize:'0.65rem',color:'#334155'}}>{ls.length}</p>
            </div>
          )
        })}
      </div>

      {loading ? (
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:10,color:'#475569'}}>
          <Loader2 size={18} style={{animation:'spin 1s linear infinite'}}/> Loading pipeline…
        </div>
      ) : (
        <div style={{flex:1,minHeight:0,overflowX:'auto',overflowY:'hidden'}}>
          <div style={{display:'flex',gap:12,height:'100%',paddingBottom:16,minWidth:`${STAGES.length*240}px`}}>
            {STAGES.map(stage=>{
              const ls=board[stage]||[]
              const st=SC[stage]
              return (
                <div key={stage} style={{width:224,flexShrink:0,display:'flex',flexDirection:'column',gap:10}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:st.bar,border:`1px solid ${st.dot}20`,borderRadius:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{width:7,height:7,borderRadius:'50%',background:st.dot}}/>
                      <span style={{fontSize:'0.78rem',fontWeight:700,color:'#e2e8f0'}}>{stage}</span>
                      <span style={{fontSize:'0.62rem',fontFamily:"'Space Mono',monospace",background:'rgba(14,165,233,0.08)',color:'#64748b',padding:'1px 6px',borderRadius:99}}>{ls.length}</span>
                    </div>
                    <span style={{fontSize:'0.7rem',fontFamily:"'Space Mono',monospace",color:'#64748b'}}>{inrShort(ls.reduce((a,l)=>a+(l.value||0),0))}</span>
                  </div>
                  <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:8,paddingRight:2}}>
                    {ls.map(l=><Card key={l.id} lead={l} onMove={handleMove}/>)}
                    {ls.length===0 && (
                      <div style={{border:'1px dashed rgba(14,165,233,0.1)',borderRadius:12,padding:20,textAlign:'center',color:'#334155',fontSize:'0.75rem'}}>Empty</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
