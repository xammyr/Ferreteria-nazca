import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { LayoutDashboard, ShoppingBag, Package, FileSpreadsheet, ExternalLink, Wrench, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  const navItemStyle = ({ isActive }) => ({
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: isActive ? '700' : '600',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: isActive ? '#F5C100' : 'transparent',
    color: isActive ? '#0f172a' : '#cbd5e1',
    transition: 'all 0.18s ease',
  })

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a', fontFamily: "'IBM Plex Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navbar (Industrial Dark Slate + Yellow Accent) */}
      <header style={{
        background: '#0f172a',
        borderBottom: '3px solid #F5C100',
        padding: '0 24px',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: '#F5C100', color: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={19} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px', lineHeight: 1.05 }}>Ferretería Nasca</div>
              <div style={{ color: '#F5C100', fontSize: '9.5px', letterSpacing: '1.2px', marginTop: '2px', textTransform: 'uppercase', fontWeight: '700' }}>Backoffice Admin</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <NavLink to="/admin" end style={navItemStyle}><LayoutDashboard size={15} /> Dashboard</NavLink>
            <NavLink to="/admin/ventas" style={navItemStyle}><ShoppingBag size={15} /> Pedidos & Ventas</NavLink>
            <NavLink to="/admin/inventario" style={navItemStyle}><Package size={15} /> Inventario</NavLink>
            <NavLink to="/admin/reportes" style={navItemStyle}><FileSpreadsheet size={15} /> Reportes Excel</NavLink>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/" style={{ fontSize: '12.5px', color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)' }}>
            <ExternalLink size={13} color="#F5C100" /> Ver Tienda
          </Link>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', height: '24px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>{admin?.nombre}</div>
              <div style={{ fontSize: '10px', color: '#F5C100', textTransform: 'uppercase', fontWeight: '700' }}>{admin?.rol}</div>
            </div>
            <button onClick={handleLogout} title="Cerrar sesión" style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="anim-page" style={{ flex: 1, padding: '28px 24px 56px', maxWidth: '1240px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
