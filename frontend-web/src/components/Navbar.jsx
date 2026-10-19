import { Wrench, Search, User, Settings, ShoppingCart, X, Menu, Package, LogOut, ClipboardList } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useClienteAuth } from '../context/ClienteAuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { totalItems, setDrawerAbierto, cartBounce } = useCarrito()
  const { cliente, logout } = useClienteAuth()
  const [buscar, setBuscar] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleBuscar(e) {
    e.preventDefault()
    if (buscar.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(buscar.trim())}`)
      setMenuAbierto(false)
    } else {
      navigate('/productos')
      setMenuAbierto(false)
    }
  }

  return (
    <>
      <nav style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid #F5C100',
        padding: isMobile ? '0 16px' : '0 28px',
        height: '66px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 14px rgba(15, 23, 42, 0.05)',
        fontFamily: "'IBM Plex Sans', sans-serif"
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '11px', flexShrink: 0 }}>
          <div style={{
            width: '38px',
            height: '38px',
            background: '#F5C100',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            boxShadow: '0 4px 10px rgba(245, 193, 0, 0.35)'
          }}>
            <Wrench size={20} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ color: '#0f172a', fontWeight: '800', fontSize: isMobile ? '15px' : '17px', lineHeight: 1.05, letterSpacing: '-0.3px' }}>
              Ferretería Nasca
            </div>
            {!isMobile && (
              <div style={{ color: '#b45309', fontSize: '9.5px', fontWeight: '700', letterSpacing: '2px', marginTop: '2px' }}>
                NASCA · ICA
              </div>
            )}
          </div>
        </Link>

        {/* Buscador — solo desktop */}
        {!isMobile && (
          <form onSubmit={handleBuscar} style={{ flex: 1, maxWidth: '420px', margin: '0 24px' }}>
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
              transition: 'all 0.2s ease'
            }}>
              <input
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
                placeholder="Buscar cemento, taladro, tubería PVC..."
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0f172a',
                  fontSize: '13px'
                }}
              />
              {buscar && (
                <button
                  type="button"
                  onClick={() => setBuscar('')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 6px', display: 'flex', alignItems: 'center' }}
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Search size={16} strokeWidth={2.3} />
              </button>
            </div>
          </form>
        )}

        {/* Links desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NavLink
              to="/"
              end
              className="nav-link-anim"
              style={({ isActive }) => ({
                color: isActive ? '#0f172a' : '#475569',
                fontWeight: isActive ? '700' : '500',
                background: isActive ? 'rgba(245, 193, 0, 0.16)' : 'transparent',
                textDecoration: 'none',
                fontSize: '13.5px',
                padding: '8px 13px',
                borderRadius: '8px'
              })}
            >
              Inicio
            </NavLink>

            <NavLink
              to="/productos"
              className="nav-link-anim"
              style={({ isActive }) => ({
                color: isActive ? '#0f172a' : '#475569',
                fontWeight: isActive ? '700' : '500',
                background: isActive ? 'rgba(245, 193, 0, 0.16)' : 'transparent',
                textDecoration: 'none',
                fontSize: '13.5px',
                padding: '8px 13px',
                borderRadius: '8px'
              })}
            >
              Catálogo
            </NavLink>

            {cliente ? (
              <>
                <Link
                  to="/mis-pedidos"
                  className="nav-link-anim"
                  style={{
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '7px 12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <User size={15} color="#b45309" /> {cliente.nombre.split(' ')[0]}
                </Link>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  style={{
                    padding: '7px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  textDecoration: 'none'
                }}
              >
                Iniciar sesión
              </Link>
            )}

            <Link
              to="/admin"
              title="Panel de Administración"
              style={{
                color: '#64748b',
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid transparent'
              }}
            >
              <Settings size={18} />
            </Link>

            {/* Botón del Carrito (Abre el Drawer lateral) */}
            <button
              onClick={() => setDrawerAbierto(true)}
              className={cartBounce ? 'cart-bounce' : ''}
              style={{
                position: 'relative',
                background: totalItems > 0 ? '#0f172a' : '#f1f5f9',
                color: totalItems > 0 ? '#F5C100' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '8px 13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginLeft: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <ShoppingCart size={19} strokeWidth={2.2} />
              {totalItems > 0 && (
                <span style={{
                  background: '#F5C100',
                  color: '#0f172a',
                  borderRadius: '20px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Mobile: carrito + hamburguesa */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setDrawerAbierto(true)}
              className={cartBounce ? 'cart-bounce' : ''}
              style={{
                position: 'relative',
                background: totalItems > 0 ? '#0f172a' : '#f1f5f9',
                color: totalItems > 0 ? '#F5C100' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '9px',
                padding: '8px 11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#F5C100',
                  color: '#0f172a',
                  borderRadius: '50%',
                  width: '19px',
                  height: '19px',
                  fontSize: '10px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff'
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '9px',
                padding: '7px 10px',
                cursor: 'pointer',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {menuAbierto ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        )}
      </nav>

      {/* Menú móvil desplegable */}
      {isMobile && menuAbierto && (
        <div
          className="anim-page"
          style={{
            position: 'fixed',
            top: '66px',
            left: 0,
            right: 0,
            zIndex: 99,
            background: '#ffffff',
            borderBottom: '2px solid #F5C100',
            boxShadow: '0 12px 28px rgba(15, 23, 42, 0.15)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Buscador móvil */}
          <form onSubmit={handleBuscar}>
            <div style={{ display: 'flex', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <input
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
                placeholder="Buscar productos..."
                style={{ flex: 1, padding: '11px 14px', background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontSize: '14px' }}
              />
              <button type="submit" style={{ padding: '11px 16px', background: '#F5C100', border: 'none', color: '#0f172a', cursor: 'pointer', fontWeight: '700' }}>
                <Search size={17} />
              </button>
            </div>
          </form>

          <Link to="/productos" onClick={() => setMenuAbierto(false)} style={{ color: '#0f172a', textDecoration: 'none', fontSize: '15px', fontWeight: '600', padding: '10px 4px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={18} color="#b45309" /> Catálogo de Productos
          </Link>

          <Link to="/admin" onClick={() => setMenuAbierto(false)} style={{ color: '#475569', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '10px 4px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={18} color="#64748b" /> Panel de Administración
          </Link>

          {cliente ? (
            <>
              <Link to="/mis-pedidos" onClick={() => setMenuAbierto(false)} style={{ color: '#0f172a', textDecoration: 'none', fontSize: '15px', fontWeight: '600', padding: '10px 4px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ClipboardList size={18} color="#b45309" /> Mis Pedidos ({cliente.nombre.split(' ')[0]})
              </Link>
              <button
                onClick={() => { logout(); setMenuAbierto(false) }}
                style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '11px', color: '#dc2626', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuAbierto(false)} style={{ padding: '12px', borderRadius: '10px', background: '#F5C100', color: '#0f172a', textDecoration: 'none', fontSize: '14px', fontWeight: '700', textAlign: 'center' }}>
              Iniciar sesión / Registrarse
            </Link>
          )}
        </div>
      )}
    </>
  )
}
