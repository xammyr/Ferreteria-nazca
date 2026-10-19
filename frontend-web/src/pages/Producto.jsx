import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  CreditCard,
  ShieldCheck,
  Store,
  Package,
  ChevronRight,
  Zap
} from 'lucide-react'
import api from '../services/api'
import { useCarrito } from '../context/CarritoContext'

export default function Producto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { agregar } = useCarrito()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCargando(true)
    setCantidad(1)
    api.get(`/productos/${id}`)
      .then(r => {
        const prod = r.data
        setProducto(prod)
        if (prod.categoria_id) {
          api.get('/productos', {
            params: {
              categoria_id: prod.categoria_id,
              solo_activos: true,
              solo_web: true,
              limit: 5
            }
          }).then(res => {
            const filtrados = (res.data.productos || []).filter(item => item.id !== prod.id).slice(0, 4)
            setRelacionados(filtrados)
          })
        }
      })
      .catch(() => navigate('/productos'))
      .finally(() => setCargando(false))
  }, [id, navigate])

  function handleAgregar() {
    agregar(producto, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  function handleComprarAhora() {
    agregar(producto, cantidad)
    navigate('/checkout')
  }

  if (cargando || !producto) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 32px' }}>
        <div className="skeleton" style={{ height: '18px', width: '240px', marginBottom: '28px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr', gap: '40px' }}>
          <div className="skeleton" style={{ height: '380px', borderRadius: '20px' }} />
          <div>
            <div className="skeleton" style={{ height: '20px', width: '35%', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '34px', width: '80%', marginBottom: '16px' }} />
            <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '24px' }} />
            <div className="skeleton" style={{ height: '42px', width: '40%', marginBottom: '28px' }} />
            <div className="skeleton" style={{ height: '50px', width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  const sinStock = (producto.stock_actual ?? 0) <= 0

  return (
    <div className="anim-page" style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '24px 16px 48px' : '36px 32px 64px' }}>

      {/* Breadcrumbs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748b', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Inicio</Link>
          <ChevronRight size={14} />
          <Link to="/productos" style={{ color: '#64748b', textDecoration: 'none' }}>Catálogo</Link>
          {producto.categorias && (
            <>
              <ChevronRight size={14} />
              <Link to={`/productos?categoria_id=${producto.categoria_id}`} style={{ color: '#64748b', textDecoration: 'none' }}>
                {producto.categorias.nombre}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span style={{ color: '#0f172a', fontWeight: '600' }}>{producto.nombre}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '7px 14px',
            color: '#334155',
            cursor: 'pointer',
            fontSize: '12.5px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={15} /> Volver
        </button>
      </div>

      {/* Contenedor Principal del Producto */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: isMobile ? '20px' : '36px',
        boxShadow: '0 8px 28px rgba(15, 23, 42, 0.05)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.15fr',
        gap: isMobile ? '28px' : '44px',
        alignItems: 'start'
      }}>

        {/* Galería / Imagen Real */}
        <div className="product-card-img-wrap" style={{
          background: '#f8fafc',
          borderRadius: '16px',
          height: isMobile ? '280px' : '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e8f0',
          padding: '20px',
          position: 'relative'
        }}>
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="product-card-img"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }}
            />
          ) : (
            <Package size={96} color="#94a3b8" strokeWidth={1.2} />
          )}

          {producto.codigo && (
            <span style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              background: '#0f172a',
              color: '#F5C100',
              fontSize: '11px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              CÓD: {producto.codigo}
            </span>
          )}
        </div>

        {/* Información y Compra */}
        <div>
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            color: '#b45309',
            background: 'rgba(245, 193, 0, 0.18)',
            padding: '4px 12px',
            borderRadius: '6px',
            fontWeight: '700',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            {producto.categorias?.nombre || 'Ferretería General'}
          </div>

          <h1 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px', lineHeight: 1.2 }}>
            {producto.nombre}
          </h1>

          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Presentación de venta: <strong style={{ color: '#334155' }}>{producto.unidad || 'unidad'}</strong>
          </div>

          <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.65, marginBottom: '22px' }}>
            {producto.descripcion || `Material de alta durabilidad disponible por ${producto.unidad || 'unidad'}. Calidad garantizada por Ferretería Nasca para tus proyectos de construcción y mejoramiento del hogar.`}
          </p>

          {/* Precio y Stock */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Precio unitario</div>
              <div style={{ fontSize: '34px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                S/ {parseFloat(producto.precio_venta).toFixed(2)}
              </div>
            </div>

            <span style={{
              padding: '7px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: sinStock ? '#fef2f2' : '#f0fdf4',
              color: sinStock ? '#dc2626' : '#16a34a',
              border: `1px solid ${sinStock ? '#fecaca' : '#bbf7d0'}`
            }}>
              {sinStock ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              {sinStock ? 'Agotado' : `En stock (${producto.stock_actual} disp.)`}
            </span>
          </div>

          {!sinStock && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#334155' }}>Cantidad:</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#ffffff', overflow: 'hidden' }}>
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      style={{ padding: '9px 14px', border: 'none', background: '#f8fafc', cursor: 'pointer', color: '#0f172a', display: 'flex' }}
                    >
                      <Minus size={15} />
                    </button>
                    <span style={{ padding: '0 18px', fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{cantidad}</span>
                    <button
                      onClick={() => setCantidad(Math.min(producto.stock_actual, cantidad + 1))}
                      style={{ padding: '9px 14px', border: 'none', background: '#f8fafc', cursor: 'pointer', color: '#0f172a', display: 'flex' }}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#475569' }}>
                  Subtotal: <strong style={{ color: '#0f172a', fontSize: '17px' }}>S/ {(parseFloat(producto.precio_venta) * cantidad).toFixed(2)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                <button
                  onClick={handleAgregar}
                  className="btn-primary"
                  style={{
                    flex: 1.2,
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: agregado ? '#16a34a' : '#F5C100',
                    color: agregado ? '#ffffff' : '#0f172a',
                    fontSize: '14.5px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {agregado ? (
                    <><CheckCircle2 size={18} /> ¡Agregado al carrito!</>
                  ) : (
                    <><ShoppingCart size={18} /> Agregar al carrito</>
                  )}
                </button>

                <button
                  onClick={handleComprarAhora}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#0f172a',
                    color: '#F5C100',
                    fontSize: '14.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Zap size={17} fill="#F5C100" /> Comprar con Yape
                </button>
              </div>
            </>
          )}

          {/* Garantías e info Yape */}
          <div style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{ background: 'rgba(245, 193, 0, 0.08)', border: '1px solid rgba(245, 193, 0, 0.35)', borderRadius: '12px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CreditCard size={18} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12.5px' }}>Pago rápido por Yape</div>
                <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>QR directo al finalizar tu pedido sin recargos.</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Store size={18} color="#0f172a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12.5px' }}>Despacho en tienda</div>
                <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>Recoge en Jr. Lima 123, Nasca con tu comprobante.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relacionados.length > 0 && (
        <section style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Productos Relacionados</h2>
            <Link to={`/productos?categoria_id=${producto.categoria_id}`} style={{ fontSize: '13px', fontWeight: '700', color: '#b45309', textDecoration: 'none' }}>
              Ver más de la categoría →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '14px'
          }}>
            {relacionados.map((rel, idx) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/producto/${rel.id}`)}
                className={`product-card delay-${idx + 1}`}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div className="product-card-img-wrap" style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {rel.imagen_url ? (
                    <img src={rel.imagen_url} alt={rel.nombre} className="product-card-img" />
                  ) : (
                    <Package size={36} color="#94a3b8" />
                  )}
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rel.nombre}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                      S/ {parseFloat(rel.precio_venta).toFixed(2)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#b45309', fontWeight: '700' }}>Ver →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
