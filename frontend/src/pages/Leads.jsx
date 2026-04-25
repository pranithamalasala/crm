import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Download, X, Loader2, MoreHorizontal, Edit2, Trash2, ChevronUp, ChevronDown, Mail } from 'lucide-react'
import { apiFetch } from '../api'
import { inrShort, inr } from '../utils/inr'
import { useNavigate } from 'react-router-dom'

const STATUSES = ['New Lead','Contacted','Demo','Negotiation','Won','Lost']
const SOURCES  = ['All Sources','LinkedIn','Referral','Website','Conference','Email']
const SC = {
  'New Lead':    'rgba(100,116,139,0.15)|#94a3b8|rgba(100,116,139,0.2)',
  'Contacted':   'rgba(56,189,248,0.12)|#38bdf8|rgba(56,189,248,0.2)',
  'Demo':        'rgba(167,139,250,0.12)|#a78bfa|rgba(167,139,250,0.2)',
  'Negotiation': 'rgba(245,158,11,0.12)|#fbbf24|rgba(245,158,11,0.2)',
  'Won':         'rgba(52,211,153,0.12)|#34d399|rgba(52,211,153,0.2)',
  'Lost':        'rgba(248,113,113,0.12)|#f87171|rgba(248,113,113,0.2)',
}
const sc = (s) => { const [bg,col,brd]=( SC[s]||SC['New Lead']).split('|'); return { background:bg,color:col,border:`1px solid ${brd}` } }

const EMPTY = { name:'',email:'',phone:'',company:'',source:'',status:'New Lead',score:'',value:'' }

export default function Leads() {
  const [leads,setLeads]=useState([])
  const [loading,setLoading]=useState(true)
  const [search,setSearch]=useState('')
  const [statusF,setStatusF]=useState('All')
  const [sourceF,setSourceF]=useState('All Sources')
  const [modal,setModal]=useState(false)
  const [editLead,setEditLead]=useState(null)
  const [form,setForm]=useState(EMPTY)
  const [saving,setSaving]=useState(false)
  const [formErr,setFormErr]=useState('')
  const [menu,setMenu]=useState(null)
  const [sortKey,setSortKey]=useState('name')
  const [sortDir,setSortDir]=useState('asc')
  const navigate = useNavigate()

  const load = useCallback(async()=>{
    setLoading(true)
    try { const {ok,data}=await apiFetch('/leads'); if(ok) setLeads(data.data||[]) }
    catch { setLeads([]) }
    finally { setLoading(false) }
  },[])

  useEffect(()=>{ load() },[load])

  const filtered = [...leads]
    .filter(l=>{
      const q=search.toLowerCase()
      return (!search || l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || (l.company||'').toLowerCase().includes(q))
        && (statusF==='All' || l.status===statusF)
        && (sourceF==='All Sources' || l.source===sourceF)
    })
    .sort((a,b)=>{
      const m=sortDir==='asc'?1:-1
      return typeof a[sortKey]==='number' ? (a[sortKey]-b[sortKey])*m : String(a[sortKey]||'').localeCompare(String(b[sortKey]||''))*m
    })

  const openAdd=()=>{ setEditLead(null); setForm(EMPTY); setFormErr(''); setModal(true) }
  const openEdit=l=>{ setEditLead(l); setForm({ name:l.name||'',email:l.email||'',phone:l.phone||'',company:l.company||'',source:l.source||'',status:l.status||'New Lead',score:l.score??'',value:l.value??'' }); setFormErr(''); setModal(true) }

  const save=async()=>{
    if(!form.name.trim()||!form.email.trim()){ setFormErr('Name and Email are required'); return }
    setSaving(true); setFormErr('')
    try {
      const body={ name:form.name.trim(),email:form.email.trim(),phone:form.phone||null,company:form.company||null,source:form.source||null,status:form.status,score:Number(form.score)||0,value:Number(form.value)||0 }
      if(editLead){
        const {ok,data}=await apiFetch(`/leads/${editLead.id}`,{method:'PUT',body:JSON.stringify(body)})
        if(ok) { setLeads(p=>p.map(l=>l.id===editLead.id?{...l,...body}:l)); setModal(false) }
        else setFormErr(data.message||'Update failed')
      } else {
        const {ok,data}=await apiFetch('/leads',{method:'POST',body:JSON.stringify(body)})
        if(ok) { await load(); setModal(false) }
        else setFormErr(data.message||'Create failed')
      }
    } catch { setFormErr('Cannot connect to server') }
    finally { setSaving(false) }
  }

  const del=async(l)=>{
    if(!confirm(`Delete "${l.name}"?`)) return
    const {ok}=await apiFetch(`/leads/${l.id}`,{method:'DELETE'})
    if(ok) setLeads(p=>p.filter(x=>x.id!==l.id))
    setMenu(null)
  }

  const exportCSV=()=>{
    const cols=['id','name','email','phone','company','source','status','score','value']
    const rows=[cols.join(','),...filtered.map(l=>cols.map(c=>JSON.stringify(l[c]??'')).join(','))]
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([rows.join('\n')],{type:'text/csv'})); a.download='leads.csv'; a.click()
  }

  const TH=({label,k})=>(
    <th onClick={()=>{ if(sortKey===k) setSortDir(d=>d==='asc'?'desc':'asc'); else{setSortKey(k);setSortDir('asc')} }}
      style={{ textAlign:'left',padding:'10px 14px',fontSize:'0.65rem',fontWeight:700,color:'#334155',textTransform:'uppercase',letterSpacing:'0.08em',cursor:'pointer',userSelect:'none',whiteSpace:'nowrap' }}>
      <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
        {label}
        <span style={{display:'inline-flex',flexDirection:'column',lineHeight:0.8}}>
          <ChevronUp size={9} color={sortKey===k&&sortDir==='asc'?'#38bdf8':'#334155'}/>
          <ChevronDown size={9} color={sortKey===k&&sortDir==='desc'?'#38bdf8':'#334155'}/>
        </span>
      </span>
    </th>
  )

  return (
    <div style={{display:'flex',flexDirection:'column',gap:18,fontFamily:"'Outfit',sans-serif"}} onClick={()=>setMenu(null)}>

      {/* Modal */}
      {modal && (
        <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(5,8,16,0.85)',backdropFilter:'blur(8px)'}}>
          <div style={{background:'#080f1a',border:'1px solid rgba(14,165,233,0.2)',borderRadius:20,padding:28,width:'100%',maxWidth:520,boxShadow:'0 0 60px rgba(14,165,233,0.1)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <div>
                <h2 style={{fontSize:'1.1rem',fontWeight:800,color:'white'}}>{editLead?'Edit Lead':'Add New Lead'}</h2>
                <p style={{fontSize:'0.72rem',color:'#475569',marginTop:2}}>Fill in the contact details</p>
              </div>
              <button onClick={()=>setModal(false)} style={{width:30,height:30,borderRadius:8,background:'rgba(14,165,233,0.08)',border:'1px solid rgba(14,165,233,0.15)',color:'#475569',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <X size={14}/>
              </button>
            </div>
            {formErr && <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171',padding:'10px 14px',borderRadius:10,fontSize:'0.82rem',marginBottom:16}}>{formErr}</div>}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['Full Name *','name','text'],['Company','company','text']].map(([l,k,t])=>(
                  <div key={k}>
                    <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>{l}</label>
                    <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                      style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.15)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:9,padding:'9px 12px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
                      onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.45)'}
                      onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.15)'}/>
                  </div>
                ))}
              </div>
              <div>
                <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>Email *</label>
                <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                  style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.15)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:9,padding:'9px 12px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
                  onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.45)'}
                  onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.15)'}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['Phone','phone','text'],['Deal Value (₹)','value','number']].map(([l,k,t])=>(
                  <div key={k}>
                    <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>{l}</label>
                    <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                      style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.15)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:9,padding:'9px 12px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box'}}
                      onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.45)'}
                      onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.15)'}/>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                {[['Source','source',['','LinkedIn','Referral','Website','Conference','Email']],['Status','status',STATUSES],['Score (0-100)','score',null]].map(([l,k,opts])=>(
                  <div key={k}>
                    <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>{l}</label>
                    {opts ? (
                      <select value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                        style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.15)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:9,padding:'9px 12px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box',cursor:'pointer'}}>
                        {opts.map(o=><option key={o} value={o} style={{background:'#080f1a'}}>{o||'Select'}</option>)}
                      </select>
                    ) : (
                      <input type="number" min="0" max="100" value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                        style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.15)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:9,padding:'9px 12px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box'}}
                        onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.45)'}
                        onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.15)'}/>
                    )}
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:10,marginTop:6}}>
                <button onClick={()=>setModal(false)} style={{flex:1,padding:'10px',background:'rgba(14,165,233,0.06)',border:'1px solid rgba(14,165,233,0.15)',color:'#7dd3fc',borderRadius:10,cursor:'pointer',fontWeight:600,fontSize:'0.85rem',fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
                <button onClick={save} disabled={saving} style={{flex:1,padding:'10px',background:'linear-gradient(135deg,#0ea5e9,#0284c7)',border:'none',color:'white',borderRadius:10,cursor:saving?'not-allowed':'pointer',fontWeight:700,fontSize:'0.85rem',fontFamily:"'Outfit',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:saving?0.7:1}}>
                  {saving?<><Loader2 size={14} style={{animation:'spin 1s linear infinite'}}/> Saving…</>:<><Plus size={14}/>{editLead?'Save Changes':'Add Lead'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div>
          <h1 style={{fontSize:'1.6rem',fontWeight:800,color:'white',letterSpacing:'-0.02em'}}>Leads</h1>
          <p style={{fontSize:'0.82rem',color:'#475569',marginTop:2}}>{leads.length} contacts · {inrShort(leads.reduce((s,l)=>s+(l.value||0),0))} pipeline</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={exportCSV} style={{display:'flex',alignItems:'center',gap:6,background:'rgba(14,165,233,0.08)',border:'1px solid rgba(14,165,233,0.15)',color:'#7dd3fc',padding:'8px 14px',borderRadius:10,cursor:'pointer',fontWeight:600,fontSize:'0.82rem',fontFamily:"'Outfit',sans-serif"}}>
            <Download size={13}/> Export CSV
          </button>
          <button onClick={openAdd} style={{display:'flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#0ea5e9,#0284c7)',border:'none',color:'white',padding:'8px 16px',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:'0.82rem',fontFamily:"'Outfit',sans-serif",boxShadow:'0 0 16px rgba(14,165,233,0.3)'}}>
            <Plus size={13}/> Add Lead
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div style={{display:'flex',gap:2,borderBottom:'1px solid rgba(14,165,233,0.08)',overflowX:'auto',flexShrink:0}}>
        {['All',...STATUSES].map(s=>{
          const cnt=s==='All'?leads.length:leads.filter(l=>l.status===s).length
          const active=statusF===s
          return (
            <button key={s} onClick={()=>setStatusF(s)} style={{
              padding:'8px 14px',fontSize:'0.78rem',fontWeight:600,fontFamily:"'Outfit',sans-serif",
              borderBottom:`2px solid ${active?'#38bdf8':'transparent'}`,
              color:active?'#38bdf8':'#475569',background:'transparent',border:'none',
              borderBottomWidth:2,borderBottomStyle:'solid',borderBottomColor:active?'#38bdf8':'transparent',
              cursor:'pointer',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:6,
            }}>
              {s}
              <span style={{fontSize:'0.65rem',fontFamily:"'Space Mono',monospace",background:active?'rgba(14,165,233,0.15)':'rgba(14,165,233,0.06)',color:active?'#38bdf8':'#334155',padding:'1px 6px',borderRadius:99}}>{cnt}</span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <div style={{position:'relative',flex:1,maxWidth:300}}>
          <Search size={13} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'#334155'}}/>
          <input placeholder="Search leads…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:'100%',background:'rgba(8,47,73,0.3)',border:'1px solid rgba(14,165,233,0.1)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:10,padding:'8px 12px 8px 32px',fontSize:'0.82rem',outline:'none',boxSizing:'border-box'}}
            onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.3)'}
            onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.1)'}/>
        </div>
        <select value={sourceF} onChange={e=>setSourceF(e.target.value)}
          style={{background:'rgba(8,47,73,0.3)',border:'1px solid rgba(14,165,233,0.1)',color:'#94a3b8',fontFamily:"'Outfit',sans-serif",borderRadius:10,padding:'8px 12px',fontSize:'0.82rem',outline:'none',cursor:'pointer'}}>
          {SOURCES.map(s=><option key={s} value={s} style={{background:'#080f1a'}}>{s}</option>)}
        </select>
        <span style={{marginLeft:'auto',fontSize:'0.72rem',color:'#334155'}}>{filtered.length} result{filtered.length!==1?'s':''}</span>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:48,gap:10,color:'#475569',background:'rgba(8,47,73,0.15)',borderRadius:16,border:'1px solid rgba(14,165,233,0.08)'}}>
          <Loader2 size={18} style={{animation:'spin 1s linear infinite'}}/> Loading leads…
        </div>
      ) : (
        <div style={{background:'rgba(8,47,73,0.15)',border:'1px solid rgba(14,165,233,0.08)',borderRadius:16,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(14,165,233,0.08)'}}>
                <TH label="Name" k="name"/>
                <TH label="Company" k="company"/>
                <TH label="Status" k="status"/>
                <TH label="Score" k="score"/>
                <TH label="Value" k="value"/>
                <TH label="Source" k="source"/>
                <th style={{width:40}}/>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l=>(
                <tr key={l.id} style={{borderBottom:'1px solid rgba(14,165,233,0.04)',cursor:'pointer',transition:'background 0.15s'}}
                  onClick={()=>navigate(`/customer/${l.id}`)}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(14,165,233,0.04)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'12px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,rgba(14,165,233,0.25),rgba(139,92,246,0.25))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:800,color:'white',flexShrink:0}}>
                        {l.name?.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <p style={{fontSize:'0.83rem',fontWeight:600,color:'#e2e8f0'}}>{l.name}</p>
                        <p style={{fontSize:'0.68rem',color:'#475569',display:'flex',alignItems:'center',gap:3}}><Mail size={9}/>{l.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'12px 14px',fontSize:'0.78rem',color:'#64748b'}}>{l.company||'—'}</td>
                  <td style={{padding:'12px 14px'}}>
                    <span style={{fontSize:'0.68rem',fontWeight:700,padding:'3px 10px',borderRadius:99,...sc(l.status)}}>{l.status}</span>
                  </td>
                  <td style={{padding:'12px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:48,height:4,background:'rgba(14,165,233,0.1)',borderRadius:99,overflow:'hidden'}}>
                        <div style={{height:'100%',borderRadius:99,background:(l.score||0)>=80?'#34d399':(l.score||0)>=60?'#fbbf24':'#64748b',width:`${l.score||0}%`}}/>
                      </div>
                      <span style={{fontSize:'0.7rem',fontFamily:"'Space Mono',monospace",color:'#94a3b8'}}>{l.score||0}</span>
                    </div>
                  </td>
                  <td style={{padding:'12px 14px',fontSize:'0.78rem',fontFamily:"'Space Mono',monospace",color:'#7dd3fc',fontWeight:700}}>{inrShort(l.value)}</td>
                  <td style={{padding:'12px 14px',fontSize:'0.75rem',color:'#64748b'}}>{l.source||'—'}</td>
                  <td style={{padding:'12px 14px',position:'relative'}} onClick={e=>e.stopPropagation()}>
                    <button onClick={e=>{e.stopPropagation();setMenu(menu===l.id?null:l.id)}}
                      style={{width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',border:'none',color:'#334155',cursor:'pointer',borderRadius:7,transition:'all 0.15s'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(14,165,233,0.1)';e.currentTarget.style.color='#38bdf8'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#334155'}}>
                      <MoreHorizontal size={15}/>
                    </button>
                    {menu===l.id && (
                      <div style={{position:'absolute',right:8,top:40,zIndex:50,background:'#080f1a',border:'1px solid rgba(14,165,233,0.15)',borderRadius:12,overflow:'hidden',minWidth:140,boxShadow:'0 16px 40px rgba(0,0,0,0.6)'}}>
                        <button onClick={()=>{setMenu(null);openEdit(l)}} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'transparent',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'0.8rem',fontFamily:"'Outfit',sans-serif",transition:'all 0.15s'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(14,165,233,0.08)';e.currentTarget.style.color='#e2e8f0'}}
                          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#94a3b8'}}>
                          <Edit2 size={12}/> Edit Lead
                        </button>
                        <button onClick={()=>del(l)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'transparent',border:'none',color:'#f87171',cursor:'pointer',fontSize:'0.8rem',fontFamily:"'Outfit',sans-serif",transition:'all 0.15s'}}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <Trash2 size={12}/> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{textAlign:'center',padding:48,color:'#334155',fontSize:'0.85rem'}}>No leads found</div>}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
