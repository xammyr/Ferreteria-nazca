import {
  Search,
  X,
  Package,
  Filter,
  Wrench,
  Hammer,
  HardHat,
  Zap,
  Droplet,
  Lightbulb,
  PaintBucket,
  Settings,
  Trees,
  ShieldAlert,
  Eye,
  ShoppingCart,
  ArrowUpDown,
  Check,
  Store
} from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import api from '../services/api'

const renderIcon = (nameOrEmoji, size = 18) => {
  switch (nameOrEmoji) {
    case 'Cemento y Concreto': return <HardHat size={size} strokeWidth={1.7} />
    case 'Herramientas Manuales': return <Hammer size={size} strokeWidth={1.7} />
    case 'Herramientas Eléctricas': return <Zap size={size} strokeWidth={1.7} />
    case 'Plomería': return <Droplet size={size} strokeWidth={1.7} />
    case 'Electricidad': return <Lightbulb size={size} strokeWidth={1.7} />
    case 'Pintura': return <PaintBucket size={size} strokeWidth={1.7} />
    case 'Fierro y Acero': return <Settings size={size} strokeWidth={1.7} />
    case 'Madera y Triplay': return <Trees size={size} strokeWidth={1.7} />
    case 'Seguridad': return <ShieldAlert size={size} strokeWidth={1.7} />
    case 'Otros': return <Package size={size} strokeWidth={1.7} />
    case 'Todos': return <Store size={size} strokeWidth={1.7} />
    default: return <Wrench size={size} strokeWidth={1.7} />
  }
}

const SidebarMenu = ({ categorias, catActiva, setCatActiva, setSidebarAbierto }) => (
  <div style={{ padding: '20px 14px' }}>
    <div style={{
      fontSize: '11px',
      fontWeight: '700',
      color: '#64748b',
      letterSpacing: '1.2px',
      marginBottom: '12px',
      paddingLeft: '8px'
    }}>
      CATEGORÍAS
    </div>
    {[{ id: null, nombre: 'Todos' }, ...categorias].map(cat => {
      const activa = catActiva === cat.id
      return (
        <div
          key={cat.id ?? 'all'}
          onClick={() => {
            setCatActiva(cat.id)
            setSidebarAbierto && setSidebarAbierto(false)
          }}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: activa ? '700' : '500',
            cursor: 'pointer',
            background: activa ? '#0f172a' : 'transparent',
            color: activa ? '#F5C100' : '#475569',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.18s ease'
          }}
        >
          <span style={{ display: 'flex', color: activa ? '#F5C100' : '#64748b' }}>
            {renderIcon(cat.nombre, 17)}
          </span>
          <span style={{ flex: 1 }}>{cat.nombre}</span>
        </div>
      )
    })}
  </div>
)

export default function Productos() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [catActiva, setCatActiva] = useState(
    searchParams.get('categoria_id') ? parseInt(searchParams.get('categoria_id')) : null
  )
  const [busqueda, setBusqueda] = useState(searchParams.get('buscar') || '')
  const [orden, setOrden] = useState('relevancia')
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { agregar, setQuickViewProducto } = useCarrito()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const paramCat = searchParams.get('categoria_id')
    const paramBuscar = searchParams.get('buscar')
    if (paramCat !== null) setCatActiva(paramCat ? parseInt(paramCat) : null)
    if (paramBuscar !== null) setBusqueda(paramBuscar)
  }, [searchParams])

  useEffect(() => {
    api.get('/categorias').then(r => setCategorias(r.data))
  }, [])

  useEffect(() => {
    setCargando(true)
    api.get('/productos', {
      params: {
        buscar: busqueda || undefined,
        categoria_id: catActiva || undefined,
        solo_activos: true,
        solo_web: true,
        limit: 100
      },
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(r => {
        setProductos(r.data.productos || [])
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [busqueda, catActiva])

  const productosFiltrados = useMemo(() => {
    let lista = [...productos]
    if (soloDisponibles) {
      lista = lista.filter(p => (p.stock_actual ?? 0) > 0)
    }
    if (orden === 'precio_asc') {
      lista.sort((a, b) => parseFloat(a.precio_venta) - parseFloat(b.precio_venta))
    } else if (orden === 'precio_desc') {
      lista.sort((a, b) => parseFloat(b.precio_venta) - parseFloat(a.precio_venta))
    } else if (orden === 'nombre_asc') {
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre))
    }
    return lista
  }, [productos, soloDisponibles, orden])

  return (
    <div className="anim-page" style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a', display: 'flex' }}>

      {/* Sidebar desktop */}
      {!isMobile && (
        <aside style={{
          width: '235px',
          flexShrink: 0,
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          position: 'sticky',
          top: '66px',
          height: 'calc(100vh - 66px)',
          overflowY: 'auto'
        }}>
          <SidebarMenu categorias={categorias} catActiva={catActiva} setCatActiva={setCatActiva} />
        </aside>
      )}

      {/* Sidebar móvil overlay */}
      {isMobile && sidebarAbierto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 250 }}>
          <div
            className="anim-modal-backdrop"
            onClick={() => setSidebarAbierto(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }}
          />
          <div
            className="anim-drawer-left"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '260px',
              background: '#ffffff',
              borderRight: '1px solid #e2e8f0',
              overflowY: 'auto',
              zIndex: 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 16px', borderBottom: '2px solid #F5C100', background: '#0f172a', color: '#ffffff' }}>
              <span style={{ fontSize: '15px', fontWeight: '700' }}>Filtrar por Categoría</span>
              <button onClick={() => setSidebarAbierto(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>
            <SidebarMenu categorias={categorias} catActiva={catActiva} setCatActiva={setCatActiva} setSidebarAbierto={setSidebarAbierto} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: isMobile ? '20px 14px 40px' : '28px 32px 56px', maxWidth: '1150px' }}>

        {/* Barra superior de búsqueda, ordenamiento y filtros */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}>
          {/* Input buscador */}
          <div style={{
            flex: '1 1 240px',
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '0 12px'
          }}>
            <Search size={16} color="#64748b" />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, marca o código..."
              style={{
                flex: 1,
                padding: '10px 10px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#0f172a',
                fontSize: '13.5px'
              }}
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {isMobile && (
              <button
                onClick={() => setSidebarAbierto(true)}
                style={{
                  padding: '9px 14px',
                  background: '#0f172a',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#F5C100',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Filter size={15} /> Categorías
              </button>
            )}

            {/* Toggle Solo en Stock */}
            <button
              onClick={() => setSoloDisponibles(!soloDisponibles)}
              style={{
                padding: '9px 13px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: soloDisponibles ? 'rgba(245, 193, 0, 0.18)' : '#f8fafc',
                color: soloDisponibles ? '#0f172a' : '#475569',
                border: `1px solid ${soloDisponibles ? '#F5C100' : '#cbd5e1'}`,
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '15px',
                height: '15px',
                borderRadius: '4px',
                background: soloDisponibles ? '#F5C100' : '#ffffff',
                border: `1px solid ${soloDisponibles ? '#F5C100' : '#94a3b8'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {soloDisponibles && <Check size={11} strokeWidth={3} color="#0f172a" />}
              </div>
              Solo con stock
            </button>

            {/* Selector de Ordenamiento */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 10px' }}>
              <ArrowUpDown size={14} color="#64748b" />
              <select
                value={orden}
                onChange={e => setOrden(e.target.value)}
                style={{
                  padding: '9px 4px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <option value="relevancia">Ordenar: Relevancia</option>
                <option value="precio_asc">Precio: Menor a Mayor</option>
                <option value="precio_desc">Precio: Mayor a Menor</option>
                <option value="nombre_asc">Nombre: A - Z</option>
              </select>
            </div>

            <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#64748b', paddingLeft: '4px' }}>
              {cargando ? 'Cargando...' : `${productosFiltrados.length} productos`}
            </div>
          </div>
        </div>

        {/* Badge de categoría activa */}
        {catActiva && (
          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '500' }}>Rubro seleccionado:</span>
            <span style={{
              padding: '5px 14px',
              background: '#0f172a',
              color: '#F5C100',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {categorias.find(c => c.id === catActiva)?.nombre}
              <button
                onClick={() => setCatActiva(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                <X size={14} />
              </button>
            </span>
          </div>
        )}

        {/* Grid de productos o Skeleton */}
        {cargando ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(215px, 1fr))',
            gap: '14px'
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
                <div className="skeleton" style={{ height: '145px', marginBottom: '12px', borderRadius: '10px' }} />
                <div className="skeleton" style={{ height: '15px', width: '85%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '12px', width: '50%', marginBottom: '14px' }} />
                <div className="skeleton" style={{ height: '36px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '72px 24px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            color: '#64748b'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#94a3b8'
            }}>
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              No encontramos productos con ese filtro
            </h3>
            <p style={{ fontSize: '13.5px', marginBottom: '20px' }}>
              Intenta buscar con otro término o limpiar los filtros aplicados.
            </p>
            <button
              onClick={() => {
                setBusqueda('')
                setCatActiva(null)
                setSoloDisponibles(false)
              }}
              className="btn-primary"
              style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px' }}
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(215px, 1fr))',
            gap: '14px'
          }}>
            {productosFiltrados.map((p, idx) => {
              const sinStock = (p.stock_actual ?? 0) <= 0
              return (
                <div
                  key={p.id}
                  className={`product-card delay-${Math.min((idx % 12) + 1, 12)}`}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div
                      className="product-card-img-wrap"
                      onClick={() => navigate(`/producto/${p.id}`)}
                      style={{
                        height: isMobile ? '130px' : '165px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {p.imagen_url ? (
                        <img src={p.imagen_url} alt={p.nombre} className="product-card-img" />
                      ) : (
                        <span style={{ color: '#94a3b8' }}>{renderIcon(p.categorias?.nombre, 40)}</span>
                      )}

                      <button
                        type="button"
                        className="quick-view-btn"
                        title="Vista rápida"
                        onClick={e => {
                          e.stopPropagation()
                          setQuickViewProducto(p)
                        }}
                      >
                        <Eye size={16} />
                      </button>

                      {p.codigo && (
                        <span style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          background: 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(4px)',
                          color: '#F5C100',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 7px',
                          borderRadius: '5px'
                        }}>
                          {p.codigo}
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '14px 14px 10px' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', marginBottom: '3px' }}>
                        {p.categorias?.nombre || 'Ferretería'}
                      </div>
                      <div
                        onClick={() => navigate(`/producto/${p.id}`)}
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#0f172a',
                          lineHeight: 1.3,
                          marginBottom: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {p.nombre}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '10px' }}>
                        Unidad: {p.unidad || 'unidad'}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                          S/ {parseFloat(p.precio_venta).toFixed(2)}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: sinStock ? '#fef2f2' : p.stock_actual > 5 ? '#f0fdf4' : '#fffbeb',
                          color: sinStock ? '#dc2626' : p.stock_actual > 5 ? '#16a34a' : '#d97706'
                        }}>
                          {sinStock ? 'Sin stock' : `${p.stock_actual} disp.`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 14px 14px' }}>
                    <button
                      onClick={() => agregar(p)}
                      disabled={sinStock}
                      className={sinStock ? '' : 'btn-primary'}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '9px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        background: sinStock ? '#f1f5f9' : '#F5C100',
                        color: sinStock ? '#94a3b8' : '#0f172a',
                        border: 'none',
                        cursor: sinStock ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <ShoppingCart size={14} />
                      {sinStock ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
