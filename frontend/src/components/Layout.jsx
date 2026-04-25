import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ onLogout, user }) {
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#050810', fontFamily:"'Outfit',sans-serif" }}>
      <Sidebar onLogout={onLogout} user={user} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <Navbar user={user} />
        <main style={{ flex:1, overflowY:'auto', padding:24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
