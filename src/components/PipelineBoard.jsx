import { useState } from 'react'
import { MoreHorizontal, Plus, TrendingUp, Clock } from 'lucide-react'

const stageColors = {
  slate:   { header: 'border-slate-500/30 bg-slate-500/5', dot: 'bg-slate-400', badge: 'bg-slate-500/20 text-slate-300' },
  blue:    { header: 'border-blue-500/30 bg-blue-500/5',   dot: 'bg-blue-400',  badge: 'bg-blue-500/20 text-blue-300' },
  violet:  { header: 'border-violet-500/30 bg-violet-500/5', dot: 'bg-violet-400', badge: 'bg-violet-500/20 text-violet-300' },
  amber:   { header: 'border-amber-500/30 bg-amber-500/5', dot: 'bg-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
  emerald: { header: 'border-emerald-500/30 bg-emerald-500/5', dot: 'bg-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
}

function DealCard({ deal, color }) {
  const col = stageColors[color]
  return (
    <div className="glass-card p-3.5 hover:border-slate-700/80 cursor-grab active:cursor-grabbing transition-all group">
      <div className="flex items-start justify-between mb-2.5">
        <p className="text-sm font-semibold text-slate-100 leading-snug pr-2">{deal.name}</p>
        <button className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-semibold text-white">
          ${deal.value.toLocaleString()}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${col.badge}`}>
          {deal.probability}%
        </span>
      </div>

      {/* Probability bar */}
      <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${col.dot}`}
          style={{ width: `${deal.probability}%`, opacity: 0.8 }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300">
            {deal.contact.split(' ').map(n => n[0]).join('')}
          </div>
          <span>{deal.contact}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{deal.daysInStage}d</span>
        </div>
      </div>
    </div>
  )
}

export default function PipelineBoard({ stages }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-0">
      {stages.map((stage) => {
        const col = stageColors[stage.color]
        const stageTotal = stage.deals.reduce((sum, d) => sum + d.value, 0)

        return (
          <div key={stage.id} className="flex-shrink-0 w-64">
            {/* Column header */}
            <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-t-xl border-b-0 border ${col.header} rounded-xl mb-3`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-xs font-semibold text-slate-200">{stage.label}</span>
                <span className="text-xs text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-full font-mono">
                  {stage.deals.length}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 font-medium">
                ${(stageTotal / 1000).toFixed(0)}k
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2.5">
              {stage.deals.map(deal => (
                <DealCard key={deal.id} deal={deal} color={stage.color} />
              ))}

              {/* Add card */}
              <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-600 hover:text-slate-400 border border-dashed border-slate-800 hover:border-slate-600 rounded-xl transition-all">
                <Plus size={12} />
                Add deal
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
