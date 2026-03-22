import { useState } from 'react'
import { Plus, BarChart2, List, Filter } from 'lucide-react'
import { pipelineStages } from '../data/mockData'
import PipelineBoard from '../components/PipelineBoard'

export default function Pipeline() {
  const [view, setView] = useState('board')

  const totalDeals   = pipelineStages.reduce((s, st) => s + st.deals.length, 0)
  const totalValue   = pipelineStages.reduce((s, st) => s + st.deals.reduce((a, d) => a + d.value, 0), 0)
  const weightedVal  = pipelineStages.reduce((s, st) => s + st.deals.reduce((a, d) => a + d.value * (d.probability / 100), 0), 0)

  return (
    <div className="space-y-5 animate-slide-up h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {totalDeals} active deals · ${totalValue.toLocaleString()} total value
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-800/60 rounded-lg p-1 border border-slate-700/40">
            <button
              onClick={() => setView('board')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${view === 'board' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <BarChart2 size={12} /> Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${view === 'list' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List size={12} /> List
            </button>
          </div>
          <button className="btn-ghost h-9 text-sm px-3">
            <Filter size={14} /> Filter
          </button>
          <button className="btn-primary h-9 text-sm">
            <Plus size={14} /> Add Deal
          </button>
        </div>
      </div>

      {/* Pipeline summary bar */}
      <div className="glass-card p-4 flex-shrink-0">
        <div className="grid grid-cols-5 divide-x divide-slate-800/60">
          {pipelineStages.map(stage => {
            const val = stage.deals.reduce((s, d) => s + d.value, 0)
            const colors = {
              slate: 'text-slate-300', blue: 'text-blue-400',
              violet: 'text-violet-400', amber: 'text-amber-400', emerald: 'text-emerald-400'
            }
            return (
              <div key={stage.id} className="text-center px-4 first:pl-0 last:pr-0">
                <p className="text-xs text-slate-500 mb-0.5">{stage.label}</p>
                <p className={`text-sm font-bold font-mono ${colors[stage.color]}`}>
                  ${val.toLocaleString()}
                </p>
                <p className="text-xs text-slate-600">{stage.deals.length} deals</p>
              </div>
            )
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Weighted pipeline: <span className="text-emerald-400 font-mono font-semibold">${Math.round(weightedVal).toLocaleString()}</span>
          </span>
          <span className="text-slate-500">
            Avg deal: <span className="text-slate-300 font-mono">${Math.round(totalValue / totalDeals).toLocaleString()}</span>
          </span>
          <span className="text-slate-500">
            Deals this month: <span className="text-slate-300 font-semibold">{totalDeals}</span>
          </span>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 min-h-0 overflow-auto">
        <PipelineBoard stages={pipelineStages} />
      </div>
    </div>
  )
}
