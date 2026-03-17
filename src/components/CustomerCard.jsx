import { useNavigate } from 'react-router-dom'
import { Mail, Phone, ArrowRight, TrendingUp } from 'lucide-react'

const statusBadge = {
  customer:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  negotiation: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  lead:        'bg-blue-500/15 text-blue-400 border-blue-500/20',
}

export default function CustomerCard({ customer }) {
  const navigate = useNavigate()

  return (
    <div
      className="glass-card p-5 hover:border-slate-700/80 transition-all cursor-pointer group"
      onClick={() => navigate(`/customer/${customer.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-glow-blue flex-shrink-0">
            {customer.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">{customer.name}</h3>
            <p className="text-xs text-slate-400">{customer.role}</p>
            <p className="text-xs text-slate-500">{customer.company}</p>
          </div>
        </div>
        <span className={`badge border ${statusBadge[customer.status] || ''}`}>
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {customer.tags.map(tag => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/40">
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between py-3 border-t border-b border-slate-800/60 mb-4">
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-0.5">Deal Value</p>
          <p className="text-sm font-mono font-semibold text-white">{customer.deal}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-0.5">Plan</p>
          <p className="text-xs font-medium text-slate-300">{customer.plan}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-0.5">Since</p>
          <p className="text-xs font-medium text-slate-300">{customer.joinDate}</p>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Mail size={11} className="text-slate-600" />
          {customer.email}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Phone size={11} className="text-slate-600" />
          {customer.phone}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{customer.activities.length} activities</span>
        <button className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors group-hover:gap-2">
          View profile
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
