import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { LayoutDashboard, ShoppingBag, Package, FileSpreadsheet, ExternalLink, Wrench } from 'lucide-react'

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
    fontWeight: '600',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: isActive ? '#F5C100' : 'transparent',
    color: isActive ? '#1f2937' : '#4b5563',
    transition: 'all 0.2s ease',
  })

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', color: '#1f2937', fontFamily: "'IBM Plex Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navbar */}
      <header style={{
        background: '#ffffff',
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
            <div style={{ width: '32px', height: '32px', background: '#F5C100', color: '#1f2937', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
              <Wrench size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ color: '#1f2937', fontWeight: '800', fontSize: '14px', lineHeight: 1 }}>Ferretería Nazca</div>
              <div style={{ color: '#F5C100', fontSize: '9px', letterSpacing: '1px', marginTop: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Panel Administración</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', gap: '6px', marginLeft: '24px' }}>
            <NavLink to="/admin" end style={navItemStyle}><LayoutDashboard size={16} /> Dashboard</NavLink>
            <NavLink to="/admin/ventas" style={navItemStyle}><ShoppingBag size={16} /> Pedidos & Ventas</NavLink>
            <NavLink to="/admin/inventario" style={navItemStyle}><Package size={16} /> Inventario</NavLink>
            <NavLink to="/admin/reportes" style={navItemStyle}><FileSpreadsheet size={16} /> Reportes Excel</NavLink>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/" target="_blank" style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
            <ExternalLink size={14} /> Ver Tienda
          </Link>
          <div style={{ borderLeft: '1px solid #e5e7eb', height: '24px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937' }}>{admin?.nombre}</div>
              <div style={{ fontSize: '10px', color: '#F5C100', textTransform: 'uppercase', fontWeight: 'bold' }}>{admin?.rol}</div>
            </div>
            <button onClick={handleLogout} style={{
              background: '#ffffff', border: '1px solid #e5e7eb', color: '#ef4444', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
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
