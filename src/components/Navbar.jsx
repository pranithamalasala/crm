import { useLocation } from 'react-router-dom'
import { Search, Bell, Plus, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const routeMeta = {
  '/dashboard': { title: 'Dashboard', crumb: ['Home', 'Dashboard'] },
  '/leads': { title: 'Leads', crumb: ['Home', 'Leads'] },
  '/pipeline': { title: 'Sales Pipeline', crumb: ['Home', 'Pipeline'] },
  '/analytics': { title: 'Analytics', crumb: ['Home', 'Analytics'] },
}

export default function Navbar() {
  const { pathname } = useLocation()
  const meta = routeMeta[pathname] || { title: 'Page', crumb: ['Home'] }
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="h-14 bg-slate-900/60 border-b border-slate-800/60 flex items-center px-6 gap-4 backdrop-blur-sm flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        {meta.crumb.map((item, i) => (
          <span key={item} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-slate-600" />}
            <span className={i === meta.crumb.length - 1 ? 'text-slate-200 font-semibold' : 'text-slate-500'}>
              {item}
            </span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div className={`flex-1 max-w-sm mx-auto relative transition-all duration-200 ${searchFocused ? 'max-w-md' : ''}`}>
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search leads, deals, customers…"
          className="input-field pl-9 py-2 text-sm h-9"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono bg-slate-700/50 px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Add new */}
        <button className="btn-primary text-sm h-9 px-3.5">
          <Plus size={14} />
          New Lead
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-slate-900" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          JT
        </div>
      </div>
    </header>
  )
}
