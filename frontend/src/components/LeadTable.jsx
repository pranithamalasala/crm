import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, MoreHorizontal, TrendingUp, Mail, Phone } from 'lucide-react'

const statusConfig = {
  hot:  { label: 'Hot',  classes: 'bg-red-500/15 text-red-400 border border-red-500/20' },
  warm: { label: 'Warm', classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/20' },
  cold: { label: 'Cold', classes: 'bg-slate-500/15 text-slate-400 border border-slate-500/20' },
}

function ScoreBar({ score }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-slate-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-300">{score}</span>
    </div>
  )
}

export default function LeadTable({ leads }) {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState('score')
  const [sortDir, setSortDir] = useState('desc')

  const sorted = [...leads].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1
    if (typeof a[sortKey] === 'number') return (a[sortKey] - b[sortKey]) * mul
    return String(a[sortKey]).localeCompare(String(b[sortKey])) * mul
  })

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortIcon = ({ col }) => (
    <span className="text-slate-500 ml-1 inline-flex flex-col -space-y-1">
      <ChevronUp size={10} className={sortKey === col && sortDir === 'asc' ? 'text-brand-400' : ''} />
      <ChevronDown size={10} className={sortKey === col && sortDir === 'desc' ? 'text-brand-400' : ''} />
    </span>
  )

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800/60">
            {[
              { label: 'Name', key: 'name' },
              { label: 'Company', key: 'company' },
              { label: 'Status', key: 'status' },
              { label: 'Score', key: 'score' },
              { label: 'Value', key: 'value' },
              { label: 'Assignee', key: 'assignee' },
              { label: 'Source', key: 'source' },
              { label: '', key: null },
            ].map(({ label, key }) => (
              <th
                key={label}
                className={`text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${key ? 'cursor-pointer hover:text-slate-300' : ''}`}
                onClick={() => key && toggleSort(key)}
              >
                {label}{key && <SortIcon col={key} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((lead) => (
            <tr
              key={lead.id}
              className="table-row cursor-pointer"
              onClick={() => navigate(`/customer/${lead.id}`)}
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/50 to-violet-500/50 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{lead.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Mail size={10} /> {lead.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-slate-300">{lead.company}</td>
              <td className="px-4 py-3.5">
                <span className={`badge ${statusConfig[lead.status].classes}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {statusConfig[lead.status].label}
                </span>
              </td>
              <td className="px-4 py-3.5"><ScoreBar score={lead.score} /></td>
              <td className="px-4 py-3.5 font-mono text-sm text-slate-200">
                ${lead.value.toLocaleString()}
              </td>
              <td className="px-4 py-3.5">
                <span className="text-slate-400 text-xs bg-slate-800/60 px-2 py-1 rounded">
                  {lead.assignee}
                </span>
              </td>
              <td className="px-4 py-3.5 text-slate-400 text-xs">{lead.source}</td>
              <td className="px-4 py-3.5">
                <button
                  className="text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
