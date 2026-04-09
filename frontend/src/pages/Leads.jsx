import { useState } from 'react'
import { Search, Download, Plus, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { leads as mockLeads } from '../data/mockData'
import LeadTable from '../components/LeadTable'

const statuses = ['All', 'Hot', 'Warm', 'Cold']
const sources  = ['All Sources', 'LinkedIn', 'Referral', 'Website', 'Conference', 'Email']

const EMPTY_FORM = {
  name:        '',
  email:       '',
  phone:       '',
  source:      '',
  status:      'New Lead',
  assigned_to: '',
}

export default function Leads() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [source, setSource] = useState('All Sources')
  const [leads, setLeads]   = useState(mockLeads)

  // Modal state
  const [showModal, setShowModal]     = useState(false)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [formError, setFormError]     = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const filtered = leads.filter(l => {
    const matchSearch = search === '' ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.company || '').toLowerCase().includes(search.toLowerCase()) ||
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

  const openModal = () => {
    setForm(EMPTY_FORM)
    setFormError('')
    setFormSuccess('')
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return
    setShowModal(false)
  }

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setFormError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and Email are required.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('http://localhost:5000/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name.trim(),
          email:       form.email.trim(),
          phone:       form.phone.trim() || null,
          source:      form.source || null,
          status:      form.status || 'New Lead',
          assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setFormError(data?.error || `Server error: ${res.status}`)
        return
      }

      // Append to local list so it shows immediately
      const newLead = {
        id:        data?.data?.id ?? Date.now(),
        name:      form.name.trim(),
        email:     form.email.trim(),
        phone:     form.phone.trim(),
        company:   '',
        source:    form.source,
        status:    'cold',
        score:     0,
        value:     0,
        assignee:  '',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setLeads(prev => [newLead, ...prev])

      setFormSuccess('Lead created successfully!')
      setTimeout(() => {
        setShowModal(false)
        setFormSuccess('')
      }, 1200)

    } catch (err) {
      setFormError('Could not connect to server. Is Flask running?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide-up">

      {/* ── Add Lead Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={closeModal}
        >
          <div
            className="glass-card w-full max-w-md p-6 shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Add New Lead</h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in the details below</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {formSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Smith"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. jane@company.com"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 415 000 0000"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Source
                  </label>
                  <select
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    className="input-field text-sm cursor-pointer"
                  >
                    <option value="">Select source</option>
                    <option>LinkedIn</option>
                    <option>Referral</option>
                    <option>Website</option>
                    <option>Conference</option>
                    <option>Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="input-field text-sm cursor-pointer"
                  >
                    <option>New Lead</option>
                    <option>Contacted</option>
                    <option>Demo</option>
                    <option>Negotiation</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="btn-ghost flex-1 justify-center text-sm h-10 border border-slate-700/40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="btn-primary flex-1 justify-center text-sm h-10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    : <><Plus size={14} /> Add Lead</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {leads.length} total leads · ${leads.reduce((s, l) => s + (l.value || 0), 0).toLocaleString()} pipeline value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-sm h-9 px-3">
            <Download size={14} /> Export
          </button>
          <button className="btn-primary text-sm h-9" onClick={openModal}>
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* ── Status Tabs ────────────────────────────────────────────── */}
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

      {/* ── Filters ────────────────────────────────────────────────── */}
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

      {/* ── Table ──────────────────────────────────────────────────── */}
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