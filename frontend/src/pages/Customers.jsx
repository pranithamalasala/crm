import{useState,useEffect}from 'react'
import{Search,Loader2,Mail,Phone,Building2,Edit2,Trash2,X}from 'lucide-react'
import{apiFetch}from '../api'
import{inrShort}from '../utils/inr'

export default function Customers(){
  const[customers,setCustomers]=useState([])
  const[loading,setLoading]=useState(true)
  const[search,setSearch]=useState('')
  const[editC,setEditC]=useState(null)
  const[form,setForm]=useState({})
  const[saving,setSaving]=useState(false)

  useEffect(()=>{apiFetch('/customers').then(({ok,data})=>{if(ok)setCustomers(data.data||[])}).finally(()=>setLoading(false))},[])

  const filtered=customers.filter(c=>!search||c.name?.toLowerCase().includes(search.toLowerCase())||c.email?.toLowerCase().includes(search.toLowerCase())||(c.company||'').toLowerCase().includes(search.toLowerCase()))

  const save=async()=>{
    setSaving(true)
    try{const{ok}=await apiFetch(`/customers/${editC.customer_id}`,{method:'PUT',body:JSON.stringify(form)})
    if(ok){setCustomers(p=>p.map(c=>c.customer_id===editC.customer_id?{...c,...form}:c));setEditC(null)}}
    finally{setSaving(false)}
  }

  const del=async(c)=>{
    if(!confirm(`Remove "${c.name}"?`))return
    const{ok}=await apiFetch(`/customers/${c.customer_id}`,{method:'DELETE'})
    if(ok)setCustomers(p=>p.filter(x=>x.customer_id!==c.customer_id))
  }

  const F=({label,k,type='text'})=>(
    <div>
      <label style={{display:'block',fontSize:'0.65rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>{label}</label>
      {k==='notes'
        ?<textarea value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} rows={3}
            style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.15)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:9,padding:'9px 12px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box',resize:'none'}}
            onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.45)'}
            onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.15)'}/>
        :<input type={type} value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
            style={{width:'100%',background:'rgba(8,47,73,0.4)',border:'1px solid rgba(14,165,233,0.15)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:9,padding:'9px 12px',fontSize:'0.85rem',outline:'none',boxSizing:'border-box'}}
            onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.45)'}
            onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.15)'}/>
      }
    </div>
  )

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18,fontFamily:"'Outfit',sans-serif"}}>
      {editC&&(
        <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(5,8,16,0.85)',backdropFilter:'blur(8px)'}}>
          <div style={{background:'#080f1a',border:'1px solid rgba(14,165,233,0.2)',borderRadius:20,padding:28,width:'100%',maxWidth:460,boxShadow:'0 0 60px rgba(14,165,233,0.1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h2 style={{fontSize:'1.1rem',fontWeight:800,color:'white'}}>Edit Customer</h2>
              <button onClick={()=>setEditC(null)} style={{width:30,height:30,borderRadius:8,background:'rgba(14,165,233,0.08)',border:'1px solid rgba(14,165,233,0.15)',color:'#475569',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={14}/></button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <F label="Name" k="name"/><F label="Company" k="company"/>
              </div>
              <F label="Email" k="email" type="email"/>
              <F label="Phone" k="phone"/>
              <F label="Notes" k="notes"/>
              <div style={{display:'flex',gap:10,marginTop:4}}>
                <button onClick={()=>setEditC(null)} style={{flex:1,padding:'10px',background:'rgba(14,165,233,0.06)',border:'1px solid rgba(14,165,233,0.15)',color:'#7dd3fc',borderRadius:10,cursor:'pointer',fontWeight:600,fontSize:'0.85rem',fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
                <button onClick={save} disabled={saving} style={{flex:1,padding:'10px',background:'linear-gradient(135deg,#0ea5e9,#0284c7)',border:'none',color:'white',borderRadius:10,cursor:saving?'not-allowed':'pointer',fontWeight:700,fontSize:'0.85rem',fontFamily:"'Outfit',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  {saving?<><Loader2 size={13} style={{animation:'spin 1s linear infinite'}}/>Saving…</>:'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 style={{fontSize:'1.6rem',fontWeight:800,color:'white',letterSpacing:'-0.02em'}}>Customers</h1>
        <p style={{fontSize:'0.82rem',color:'#475569',marginTop:2}}>{customers.length} converted customers</p>
      </div>

      <div style={{position:'relative',maxWidth:300}}>
        <Search size={13} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'#334155'}}/>
        <input placeholder="Search customers…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{width:'100%',background:'rgba(8,47,73,0.3)',border:'1px solid rgba(14,165,233,0.1)',color:'#e2e8f0',fontFamily:"'Outfit',sans-serif",borderRadius:10,padding:'8px 12px 8px 32px',fontSize:'0.82rem',outline:'none',boxSizing:'border-box'}}
          onFocus={e=>e.target.style.borderColor='rgba(14,165,233,0.3)'}
          onBlur={e=>e.target.style.borderColor='rgba(14,165,233,0.1)'}/>
      </div>

      {loading?(
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:64,gap:10,color:'#475569'}}><Loader2 size={18} style={{animation:'spin 1s linear infinite'}}/>Loading…</div>
      ):filtered.length===0?(
        <div style={{textAlign:'center',padding:64,background:'rgba(8,47,73,0.15)',border:'1px solid rgba(14,165,233,0.08)',borderRadius:16}}>
          <p style={{color:'#475569',fontWeight:600,marginBottom:6}}>{search?'No results':'No customers yet'}</p>
          <p style={{color:'#334155',fontSize:'0.82rem'}}>Move leads to "Won" in the Pipeline to convert them.</p>
        </div>
      ):(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
          {filtered.map(c=>(
            <div key={c.customer_id} style={{background:'rgba(8,47,73,0.2)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:16,padding:20,transition:'all 0.3s',position:'relative'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(14,165,233,0.25)';e.currentTarget.style.boxShadow='0 8px 32px rgba(14,165,233,0.08)';e.currentTarget.querySelector('.cta').style.opacity='1'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(14,165,233,0.1)';e.currentTarget.style.boxShadow='none';e.currentTarget.querySelector('.cta').style.opacity='0'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#10b981,#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',fontWeight:800,color:'white',flexShrink:0,boxShadow:'0 0 16px rgba(16,185,129,0.3)'}}>
                  {c.name?.split(' ').map(n=>n[0]).join('')}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <h3 style={{fontSize:'0.9rem',fontWeight:700,color:'white',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</h3>
                  <p style={{fontSize:'0.72rem',color:'#475569',display:'flex',alignItems:'center',gap:4,marginTop:2}}><Building2 size={10}/>{c.company||'N/A'}</p>
                </div>
                <span style={{fontSize:'0.62rem',fontWeight:700,padding:'2px 8px',borderRadius:99,background:'rgba(52,211,153,0.1)',color:'#34d399',border:'1px solid rgba(52,211,153,0.2)',flexShrink:0}}>Customer</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.75rem',color:'#64748b'}}><Mail size={11} color="#334155"/>{c.email}</div>
                {c.phone&&<div style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.75rem',color:'#64748b'}}><Phone size={11} color="#334155"/>{c.phone}</div>}
              </div>
              {c.notes&&<p style={{fontSize:'0.72rem',color:'#475569',lineHeight:1.6,marginBottom:12,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{c.notes}</p>}
              <p style={{fontSize:'0.65rem',color:'#334155',marginBottom:12}}>Since {c.created_at?.slice(0,10)||'N/A'}</p>
              <div className="cta" style={{display:'flex',gap:8,opacity:0,transition:'opacity 0.2s'}}>
                <button onClick={()=>{setEditC(c);setForm({name:c.name,email:c.email,phone:c.phone||'',company:c.company||'',notes:c.notes||''})}}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'7px',background:'rgba(14,165,233,0.08)',border:'1px solid rgba(14,165,233,0.15)',color:'#7dd3fc',borderRadius:9,cursor:'pointer',fontSize:'0.75rem',fontFamily:"'Outfit',sans-serif",fontWeight:600}}>
                  <Edit2 size={11}/> Edit
                </button>
                <button onClick={()=>del(c)}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'7px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',color:'#f87171',borderRadius:9,cursor:'pointer',fontSize:'0.75rem',fontFamily:"'Outfit',sans-serif",fontWeight:600}}>
                  <Trash2 size={11}/> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
