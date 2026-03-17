import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('jake@acmecorp.io')
  const [password, setPassword] = useState('password')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (email && password) {
      onLogin()
      navigate('/dashboard')
    } else {
      setError('Please enter your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="w-full max-w-md px-4 relative animate-slide-up">
        {/* Card */}
        <div className="glass-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-blue">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-white">Nexus</span>
                <span className="text-xl font-bold text-brand-400">CRM</span>
              </div>
              <p className="text-xs text-slate-500">Modern Sales Intelligence</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to your workspace to continue</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  className="input-field pl-10"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.io"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Password
                </label>
                <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPass(v => !v)}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="remember" className="w-3.5 h-3.5 accent-brand-500 rounded" />
              <label htmlFor="remember" className="text-xs text-slate-400">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center h-11 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
                Start free trial
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Demo: any email / password works
        </p>
      </div>
    </div>
  )
}
