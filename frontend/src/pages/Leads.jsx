import { useState } from 'react'
import { Search, Filter, Download, Plus, SlidersHorizontal } from 'lucide-react'
import { leads } from '../data/mockData'
import LeadTable from '../components/LeadTable'

const statuses = ['All', 'Hot', 'Warm', 'Cold']
const sources  = ['All Sources', 'LinkedIn', 'Referral', 'Website', 'Conference', 'Email']

export default function Leads() {
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('All')
  const [source, setSource]       = useState('All Sources')

  const filtered = leads.filter(l => {
    const matchSearch = search === '' ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'All' || l.status === status.toLowerCase()
    const matchSource = source === 'All Sources' || l.source === source
    return matchSearch && matchStatus && matchSource
  })

  const totals = {
    all:  leads.length,
    hot:  leads.filter(l => l.status === 'hot').length,
    warm: leads.filter(l => l.status === 'warm').length,
    cold: leads.filter(l => l.status === 'cold').length,
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {leads.length} total leads · ${leads.reduce((s, l) => s + l.value, 0).toLocaleString()} pipeline value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-sm h-9 px-3">
            <Download size={14} /> Export
          </button>
          <button className="btn-primary text-sm h-9">
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800/60">
        {statuses.map(s => {
          const count = s === 'All' ? totals.all : totals[s.toLowerCase()]
          const isActive = status === s
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
                isActive
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {s}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-mono ${isActive ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads…"
            className="input-field pl-9 h-9 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field h-9 text-sm w-40 cursor-pointer"
          value={source}
          onChange={e => setSource(e.target.value)}
        >
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn-ghost h-9 text-sm px-3">
          <SlidersHorizontal size={14} /> Filters
        </button>
        <span className="ml-auto text-xs text-slate-500">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <LeadTable leads={filtered} />
      ) : (
        <div className="glass-card py-16 text-center">
          <p className="text-slate-400 font-medium mb-1">No leads found</p>
          <p className="text-slate-600 text-sm">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  )
}
