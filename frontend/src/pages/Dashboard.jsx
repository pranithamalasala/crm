import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity } from 'lucide-react'
import { revenueData, conversionData, leads } from '../data/mockData'
import CustomerCard from '../components/CustomerCard'
import { customers } from '../data/mockData'

const stats = [
  { label: 'Total Revenue', value: '$369K', change: '+18.2%', up: true,  icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Active Leads',  value: '284',   change: '+12.5%', up: true,  icon: Users,      color: 'text-brand-400',   bg: 'bg-brand-500/10' },
  { label: 'Win Rate',      value: '34%',   change: '-2.1%',  up: false, icon: Target,     color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { label: 'Avg Deal Size', value: '$38.4K',change: '+6.8%',  up: true,  icon: Activity,   color: 'text-amber-400',   bg: 'bg-amber-500/10' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-mono font-semibold">
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, Jake 👋</h1>
          <p className="text-slate-400 text-sm mt-0.5">Here's what's happening with your pipeline today.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">March 17, 2026</p>
          <p className="text-xs text-emerald-400 font-medium mt-0.5">↑ 3 deals closing this week</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={15} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className={`text-xs font-medium flex items-center gap-1 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
              {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="glass-card p-5 col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Revenue vs Target</h2>
              <p className="text-xs text-slate-500">Last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-brand-500" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-600" /> Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area dataKey="target" stroke="#334155" strokeWidth={1.5} fill="none" strokeDasharray="4 4" dot={false} />
              <Area dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: '#3b82f6', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div className="glass-card p-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Conversion Funnel</h2>
            <p className="text-xs text-slate-500">This month</p>
          </div>
          <div className="space-y-2.5">
            {conversionData.map((d, i) => {
              const pct = Math.round((d.count / conversionData[0].count) * 100)
              const colors = ['bg-brand-500', 'bg-violet-500', 'bg-indigo-500', 'bg-amber-500', 'bg-emerald-500']
              return (
                <div key={d.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{d.stage}</span>
                    <span className="font-mono text-slate-300">{d.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full">
                    <div className={`h-full rounded-full ${colors[i]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/60">
            <p className="text-xs text-slate-500">Overall conversion</p>
            <p className="text-lg font-bold text-emerald-400 font-mono">6.3%</p>
          </div>
        </div>
      </div>

      {/* Recent customers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Key Accounts</h2>
          <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {customers.map(c => <CustomerCard key={c.id} customer={c} />)}
        </div>
      </div>

      {/* Recent leads mini-table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Recent Leads</h2>
          <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</button>
        </div>
        <div className="space-y-2">
          {leads.slice(0, 4).map(lead => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500/40 to-violet-500/40 flex items-center justify-center text-[10px] font-bold text-white">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">{lead.name}</p>
                  <p className="text-[10px] text-slate-500">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-300">${lead.value.toLocaleString()}</span>
                <span className={`badge text-[10px] ${lead.status === 'hot' ? 'bg-red-500/15 text-red-400' : lead.status === 'warm' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-500/15 text-slate-400'}`}>
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
