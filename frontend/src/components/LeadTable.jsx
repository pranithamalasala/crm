import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, MoreHorizontal, Mail } from 'lucide-react'
import { leads as mockLeads } from '../data/mockData'

const statusConfig = {
hot:  { label: 'Hot',  classes: 'bg-red-500/15 text-red-400 border border-red-500/20' },
warm: { label: 'Warm', classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/20' },
cold: { label: 'Cold', classes: 'bg-slate-500/15 text-slate-400 border border-slate-500/20' },
new:  { label: 'New',  classes: 'bg-blue-500/15 text-blue-400 border border-blue-500/20' },
contacted: { label: 'Contacted', classes: 'bg-green-500/15 text-green-400 border border-green-500/20' }
}

function ScoreBar({ score }) {
const color =
score >= 80 ? 'bg-emerald-500'
: score >= 60 ? 'bg-amber-500'
: 'bg-slate-500'

return ( <div className="flex items-center gap-2"> <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
<div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} /> </div> <span className="text-xs font-mono text-slate-300">{score}</span> </div>
)
}

export default function LeadTable() {
const navigate = useNavigate()

const [leads, setLeads] = useState([])
const [sortKey, setSortKey] = useState('name')
const [sortDir, setSortDir] = useState('asc')

// 🔥 API CALL (FINAL FIXED)
useEffect(() => {
fetch("http://localhost:5000/leads")
.then(res => res.json())
.then(res => {
  console.log("API DATA:", res);
const formatted = res.data.map(l => ({
id: l.id,
name: l.name,
email: l.email,
status: l.status,
source: l.source,
assignee: l.assigned_user, // 🔥 mapping
company: "N/A",
score: Math.floor(Math.random() * 100), // temporary
value: Math.floor(Math.random() * 10000) // temporary
}))
setLeads(formatted)
})
.catch(() => {
console.log("API failed → using mock")
setLeads(mockLeads)
})
}, [])

const sorted = [...leads].sort((a, b) => {
const mul = sortDir === 'asc' ? 1 : -1
if (typeof a[sortKey] === 'number') return (a[sortKey] - b[sortKey]) * mul
return String(a[sortKey]).localeCompare(String(b[sortKey])) * mul
})

const toggleSort = (key) => {
if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
else { setSortKey(key); setSortDir('asc') }
}

const SortIcon = ({ col }) => ( <span className="text-slate-500 ml-1 inline-flex flex-col -space-y-1">
<ChevronUp size={10} className={sortKey === col && sortDir === 'asc' ? 'text-blue-400' : ''} />
<ChevronDown size={10} className={sortKey === col && sortDir === 'desc' ? 'text-blue-400' : ''} /> </span>
)

return ( <div className="glass-card overflow-hidden"> <table className="w-full text-sm"> <thead> <tr className="border-b border-slate-800/60">
{[
{ label: 'Name', key: 'name' },
{ label: 'Status', key: 'status' },
{ label: 'Score', key: 'score' },
{ label: 'Value', key: 'value' },
{ label: 'Assignee', key: 'assignee' },
{ label: 'Source', key: 'source' },
].map(({ label, key }) => (
<th
key={label}
className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase cursor-pointer"
onClick={() => toggleSort(key)}
>
{label} <SortIcon col={key} /> </th>
))} </tr> </thead>

```
    <tbody>
      {sorted.map((lead) => (
        <tr
          key={lead.id}
          className="hover:bg-slate-800/40 cursor-pointer"
          onClick={() => navigate(`/customer/${lead.id}`)}
        >
          <td className="px-4 py-3.5">
            <div>
              <p className="font-medium text-slate-100">{lead.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Mail size={10} /> {lead.email}
              </p>
            </div>
          </td>

          <td className="px-4 py-3.5">
            <span className={`px-2 py-1 text-xs rounded ${statusConfig[lead.status]?.classes}`}>
              {statusConfig[lead.status]?.label || lead.status}
            </span>
          </td>

          <td className="px-4 py-3.5">
            <ScoreBar score={lead.score} />
          </td>

          <td className="px-4 py-3.5 text-slate-200 font-mono">
            ${lead.value.toLocaleString()}
          </td>

          <td className="px-4 py-3.5 text-slate-400 text-xs">
            {lead.assignee}
          </td>

          <td className="px-4 py-3.5 text-slate-400 text-xs">
            {lead.source}
          </td>

          <td className="px-4 py-3.5">
            <MoreHorizontal size={16} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


)
}
