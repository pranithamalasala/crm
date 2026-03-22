import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, Building2, Calendar,
  Tag, MessageSquare, PhoneCall, GitBranch, Star,
  TrendingUp, Edit2, MoreHorizontal
} from 'lucide-react'
import { customers, leads } from '../data/mockData'

const activityIcon = { call: PhoneCall, email: Mail, deal: GitBranch, meeting: Calendar }
const activityColor = {
  call:    'bg-blue-500/15 text-blue-400 border-blue-500/20',
  email:   'bg-violet-500/15 text-violet-400 border-violet-500/20',
  deal:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  meeting: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
}

const statusBadge = {
  customer:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  negotiation: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  hot:         'bg-red-500/15 text-red-400 border-red-500/20',
  warm:        'bg-amber-500/15 text-amber-400 border-amber-500/20',
  cold:        'bg-slate-500/15 text-slate-400 border-slate-500/20',
}

export default function CustomerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const customer = customers.find(c => c.id === Number(id))
  const lead = leads.find(l => l.id === Number(id))

  const person = customer || (lead ? {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    role: 'Contact',
    avatar: lead.name.split(' ').map(n => n[0]).join(''),
    status: lead.status,
    deal: `$${lead.value.toLocaleString()}`,
    plan: lead.source,
    joinDate: lead.createdAt,
    tags: [lead.status.charAt(0).toUpperCase() + lead.status.slice(1), lead.source, 'Lead'],
    notes: `Lead assigned to ${lead.assignee}. Lead score: ${lead.score}/100. Source: ${lead.source}.`,
    activities: [
      { type: 'email', label: 'Initial outreach sent', date: '1 week ago' },
      { type: 'call',  label: 'Discovery call completed', date: '3 days ago' },
      { type: 'email', label: 'Follow-up email sent', date: 'Yesterday' },
    ]
  } : null)

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-fade-in">
        <p className="text-lg font-semibold mb-3 text-slate-300">Profile not found</p>
        <p className="text-sm mb-5">The contact with ID #{id} does not exist.</p>
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
          <ArrowLeft size={14} /> Go back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-slide-up max-w-5xl">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={15} /> Back to list
      </button>

      {/* Hero card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-glow-blue">
              {person.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse-slow" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <h1 className="text-2xl font-bold text-white">{person.name}</h1>
                  <button className="text-slate-600 hover:text-amber-400 transition-colors">
                    <Star size={15} />
                  </button>
                </div>
                <p className="text-slate-400 text-sm">{person.role} · <span className="text-slate-300">{person.company}</span></p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`badge border text-xs ${statusBadge[person.status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                </span>
                <button className="btn-ghost h-9 text-sm px-3">
                  <Edit2 size={13} /> Edit
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-slate-700/40">
                  <MoreHorizontal size={15} />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {person.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/40">
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick contact strip */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-800/60">
          {[
            { label: 'Email', value: person.email, icon: Mail },
            { label: 'Phone', value: person.phone, icon: Phone },
            { label: 'Company', value: person.company, icon: Building2 },
            { label: 'Member Since', value: person.joinDate, icon: Calendar },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="min-w-0">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                <Icon size={10} /> {label}
              </p>
              <p className="text-sm text-slate-200 font-medium truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-5">
          <button className="btn-primary text-sm h-9">
            <Mail size={13} /> Send Email
          </button>
          <button className="btn-ghost text-sm h-9 px-3 border border-slate-700/40">
            <PhoneCall size={13} /> Log Call
          </button>
          <button className="btn-ghost text-sm h-9 px-3 border border-slate-700/40">
            <Calendar size={13} /> Schedule Meeting
          </button>
          <button className="btn-ghost text-sm h-9 px-3 border border-slate-700/40">
            <GitBranch size={13} /> Create Deal
          </button>
        </div>
      </div>

      {/* Three-column detail grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Deal Overview */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-brand-400" /> Deal Overview
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Deal Value',     value: person.deal },
              { label: 'Plan / Source',  value: person.plan },
              { label: 'Status',         value: person.status.charAt(0).toUpperCase() + person.status.slice(1) },
              { label: 'Contact Since',  value: person.joinDate },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center text-sm border-b border-slate-800/40 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-200 font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Mini score bar if it's a lead */}
          {lead && (
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500">Lead Score</span>
                <span className="font-mono text-slate-200 font-semibold">{lead.score}/100</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 60 ? 'bg-amber-500' : 'bg-slate-500'}`}
                  style={{ width: `${lead.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="glass-card p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MessageSquare size={14} className="text-violet-400" /> Notes
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed flex-1">{person.notes}</p>
          <div className="mt-4 pt-4 border-t border-slate-800/60">
            <textarea
              placeholder="Add a note…"
              rows={2}
              className="input-field text-sm resize-none"
            />
            <button className="btn-primary text-xs h-8 mt-2 px-3">
              Save Note
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={14} className="text-amber-400" /> Activity Timeline
          </h2>
          <div className="space-y-4 relative">
            {/* Timeline line */}
            <div className="absolute left-3.5 top-3.5 bottom-3.5 w-px bg-slate-800/60" />

            {person.activities.map((act, i) => {
              const Icon = activityIcon[act.type] || Mail
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border relative z-10 ${activityColor[act.type]}`}>
                    <Icon size={11} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs text-slate-300 font-medium leading-snug">{act.label}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{act.date}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="mt-4 w-full text-xs text-slate-500 hover:text-slate-300 py-2 border border-dashed border-slate-800 hover:border-slate-600 rounded-lg transition-all">
            + Log activity
          </button>
        </div>
      </div>
    </div>
  )
}
