import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  const navItemStyle = ({ isActive }) => ({
    padding: '9px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: isActive ? '#F5C100' : 'transparent',
    color: isActive ? '#0a0a0a' : '#aaa',
    transition: 'all 0.2s ease',
  })

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'IBM Plex Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navbar */}
      <header style={{
        background: '#111',
        borderBottom: '2px solid #F5C100',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#F5C100', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>⚡</div>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px', lineHeight: 1 }}>Ferretería Nazca</div>
              <div style={{ color: '#F5C100', fontSize: '9px', letterSpacing: '1px', marginTop: '2px', textTransform: 'uppercase' }}>Panel Administración</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', gap: '6px', marginLeft: '12px' }}>
            <NavLink to="/admin" end style={navItemStyle}>📊 Dashboard</NavLink>
            <NavLink to="/admin/ventas" style={navItemStyle}>🛍️ Pedidos & Ventas</NavLink>
            <NavLink to="/admin/inventario" style={navItemStyle}>📦 Inventario</NavLink>
            <NavLink to="/admin/reportes" style={navItemStyle}>📑 Reportes Excel</NavLink>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/" target="_blank" style={{ fontSize: '12px', color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🌐 Ver Tienda ↗
          </Link>
          <div style={{ borderLeft: '1px solid #2a2a2a', height: '24px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{admin?.nombre}</div>
              <div style={{ fontSize: '10px', color: '#F5C100', textTransform: 'uppercase' }}>{admin?.rol}</div>
            </div>
            <button onClick={handleLogout} style={{
              background: '#1a1a1a', border: '0.5px solid #333', color: '#ff6b6b', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer'
            }}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
