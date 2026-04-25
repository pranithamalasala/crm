import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Pipeline from './pages/Pipeline'
import Customers from './pages/Customers'
import Analytics from './pages/Analytics'
import CustomerProfile from './pages/CustomerProfile'
import Layout from './components/Layout'

export default function App() {
  const [user, setUser] = useState(() => {
    try { const s = sessionStorage.getItem('orbit_user'); return s ? JSON.parse(s) : null } catch { return null }
  })

  const handleLogin = (u) => { sessionStorage.setItem('orbit_user', JSON.stringify(u)); setUser(u) }
  const handleLogout = () => { sessionStorage.removeItem('orbit_user'); setUser(null) }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Layout onLogout={handleLogout} user={user} /> : <Navigate to="/login" replace />}>
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="leads"      element={<Leads />} />
          <Route path="pipeline"   element={<Pipeline />} />
          <Route path="customers"  element={<Customers />} />
          <Route path="analytics"  element={<Analytics />} />
          <Route path="customer/:id" element={<CustomerProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
