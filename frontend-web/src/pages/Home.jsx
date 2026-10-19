import {
  CreditCard,
  MessageSquare,
  Store,
  PackageCheck,
  Zap,
  Droplet,
  Lightbulb,
  PaintBucket,
  Settings,
  Trees,
  ShieldAlert,
  Package,
  Wrench,
  Hammer,
  HardHat,
  MapPin,
  Eye,
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { useCarrito } from '../context/CarritoContext'
import api from '../services/api'

const HERO_BG = 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780817404/productos_de_ferreteria_herramientas_manuales_oygptj.webp'
const LOCAL_IMG = 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780816884/000eba55204a0b757a380fe92df73a10_qduaco.webp'

const renderIcon = (nameOrEmoji, size = 26) => {
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
    default: return <Wrench size={size} strokeWidth={1.7} />
  }
}

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let current = 0
    const step = Math.max(1, Math.ceil(target / 28))
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [target])

  return <>{count}{suffix}</>
}

export default function Home() {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [catActiva, setCatActiva] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { agregar, setQuickViewProducto } = useCarrito()
  const navigate = useNavigate()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setCargando(true)
    Promise.all([
      api.get('/categorias'),
      api.get('/productos', { params: { solo_activos: true, solo_web: true, limit: 12 } })
    ]).then(([cats, prods]) => {
      setCategorias(cats.data)
      setProductos(prods.data.productos)
    }).finally(() => setCargando(false))
  }, [])

  function filtrarPorCategoria(id) {
    const nuevoId = catActiva === id ? null : id
    setCatActiva(nuevoId)
    setCargando(true)
    api.get('/productos', {
      params: {
        categoria_id: nuevoId || undefined,
        solo_activos: true,
        solo_web: true,
        limit: 12
      }
    }).then(r => setProductos(r.data.productos))
      .finally(() => setCargando(false))
  }

  function verTodosDeCategoria(id) {
    navigate(id ? `/productos?categoria_id=${id}` : '/productos')
  }

  const cardW = isMobile ? '178px' : '236px'

  return (
    <div className="anim-page" style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>

      {/* ── HERO INDUSTRIAL DE ALTO CONTRASTE ─────────────────────────── */}
      <section className="anim-hero" style={{
        position: 'relative',
        borderBottom: '3px solid #F5C100',
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
        {/* Gradiente oscuro para máximo contraste */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.84) 55%, rgba(15, 23, 42, 0.72) 100%)'
        }} />

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: isMobile ? '44px 20px' : '68px 32px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="anim-hero-text" style={{ flex: 1, maxWidth: '580px', width: '100%' }}>
            <div className="anim-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245, 193, 0, 0.16)',
              border: '1px solid rgba(245, 193, 0, 0.45)',
              color: '#F5C100',
              borderRadius: '20px',
              padding: '6px 15px',
              fontSize: '11.5px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '20px'
            }}>
              <Zap size={14} fill="#F5C100" /> FERRETERÍA #1 EN NASCA
            </div>

            <h1 style={{
              fontSize: isMobile ? '34px' : '48px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.12,
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              Todo para tu<br />
              <span style={{ color: '#F5C100' }}>obra y hogar</span>
            </h1>

            <p style={{
              fontSize: isMobile ? '15px' : '16.5px',
              color: '#cbd5e1',
              lineHeight: 1.65,
              marginBottom: '28px',
              maxWidth: '480px'
            }}>
              Cemento, fierro corrugado, herramientas eléctricas, plomería y acabados con stock real. Compra online con <strong style={{ color: '#F5C100' }}>Yape</strong> y recoge sin esperas.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/productos')}
                className="btn-primary"
                style={{
                  padding: '14px 28px',
                  borderRadius: '10px',
                  fontSize: '14.5px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Explorar catálogo <ArrowRight size={17} />
              </button>

              <a
                href="https://wa.me/51999888777?text=Hola%20Ferreter%C3%ADa%20Nasca,%20quisiera%20hacer%20una%20cotizaci%C3%B3n"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-light"
                style={{
                  padding: '14px 24px',
                  borderRadius: '10px',
                  fontSize: '14.5px',
                  fontWeight: '600',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MessageSquare size={17} color="#F5C100" /> Cotizar por WhatsApp
              </a>
            </div>

            {/* Contadores animados */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              gap: isMobile ? '22px' : '36px',
              marginTop: '34px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              justifyContent: 'start'
            }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#F5C100' }}>
                  <AnimatedCounter target={75} suffix="+" />
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Productos en stock</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#F5C100' }}>
                  <AnimatedCounter target={10} suffix="" />
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Rubros ferreteros</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#F5C100' }}>
                  <AnimatedCounter target={100} suffix="%" />
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Compra segura Yape</div>
              </div>
            </div>
          </div>

          {/* Tarjeta de imagen del local */}
          <div className="hero-img-anim" style={{
            position: 'relative',
            flexShrink: 0,
            width: isMobile ? '100%' : '370px',
            height: isMobile ? '220px' : '260px',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '2px solid #F5C100',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)'
          }}>
            <img src={LOCAL_IMG} alt="Ferretería Nasca Local" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 55%)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              right: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(245, 193, 0, 0.35)',
              borderRadius: '10px',
              padding: '8px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                <MapPin size={14} color="#F5C100" /> Jr. Lima 123, Nasca
              </div>
              <span style={{ fontSize: '10px', background: '#22c55e', color: '#052e16', fontWeight: '800', padding: '2px 8px', borderRadius: '20px' }}>
                ABIERTO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BARRA DE BENEFICIOS ───────────────────────────────────────── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)'
        }}>
          {[
            [<CreditCard size={20} />, 'Pago directo Yape', 'Sin comisiones adicionales'],
            [<MessageSquare size={20} />, 'Asesoría inmediata', 'Atención por WhatsApp'],
            [<Store size={20} />, 'Recojo rápido', 'Listo en tienda en minutos'],
            [<PackageCheck size={20} />, 'Stock garantizado', 'Inventario en tiempo real']
          ].map(([icon, title, sub], i) => (
            <div
              key={title}
              style={{
                padding: isMobile ? '16px 14px' : '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderRight: (!isMobile && i < 3) ? '1px solid #f1f5f9' : 'none',
                borderBottom: (isMobile && i < 2) ? '1px solid #f1f5f9' : 'none'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(245, 193, 0, 0.15)',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>{title}</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* ── CATEGORÍAS INTERACTIVAS ─────────────────────────────────── */}
        <section style={{ padding: isMobile ? '32px 16px 0' : '44px 32px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '4px' }}>
                Explora por rubro
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Categorías Principales</h2>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {catActiva && (
                <button
                  onClick={() => filtrarPorCategoria(catActiva)}
                  style={{ fontSize: '12.5px', color: '#64748b', background: '#e2e8f0', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Mostrar todas ✕
                </button>
              )}
              <button
                onClick={() => verTodosDeCategoria(catActiva)}
                style={{ fontSize: '13px', fontWeight: '700', color: '#b45309', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Ir al catálogo <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(112px, 1fr))',
            gap: '10px'
          }}>
            {categorias.map((cat, idx) => {
              const activa = catActiva === cat.id
              return (
                <div
                  key={cat.id}
                  onClick={() => filtrarPorCategoria(cat.id)}
                  className={`anim-cat-card delay-${Math.min(idx + 1, 12)}`}
                  style={{
                    background: activa ? '#0f172a' : '#ffffff',
                    border: `1.5px solid ${activa ? '#F5C100' : '#e2e8f0'}`,
                    borderRadius: '14px',
                    padding: '16px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: activa ? '0 8px 20px rgba(15, 23, 42, 0.15)' : '0 1px 3px rgba(15, 23, 42, 0.03)'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    margin: '0 auto 10px',
                    borderRadius: '12px',
                    background: activa ? 'rgba(245, 193, 0, 0.18)' : '#f8fafc',
                    color: activa ? '#F5C100' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {renderIcon(cat.nombre, 24)}
                  </div>
                  <div style={{
                    fontSize: '11.5px',
                    fontWeight: activa ? '700' : '600',
                    color: activa ? '#ffffff' : '#334155',
                    lineHeight: 1.3
                  }}>
                    {cat.nombre}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── CARRUSEL DE PRODUCTOS DESTACADOS ────────────────────────── */}
        <section style={{ padding: isMobile ? '32px 16px 40px' : '44px 32px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '4px' }}>
                <Sparkles size={13} /> Selección destacada
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                {catActiva ? `Productos en ${categorias.find(c => c.id === catActiva)?.nombre || ''}` : 'Productos Destacados'}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/productos" style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textDecoration: 'none', marginRight: '6px' }}>
                Ver todos ({productos.length}) →
              </Link>
              <button
                onClick={scrollPrev}
                className="carousel-btn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                className="carousel-btn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#F5C100',
                  border: 'none',
                  color: '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Skeleton Loader o Carrusel */}
          {cargando ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: '14px' }}>
              {Array.from({ length: isMobile ? 2 : 5 }).map((_, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
                  <div className="skeleton" style={{ height: '140px', marginBottom: '12px', borderRadius: '10px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '12px', width: '50%', marginBottom: '14px' }} />
                  <div className="skeleton" style={{ height: '34px', width: '100%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div ref={emblaRef} style={{ overflow: 'hidden', padding: '6px 2px 14px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                {productos.map((p, pidx) => {
                  const sinStock = (p.stock_actual ?? 0) <= 0
                  return (
                    <div
                      key={p.id}
                      className={`product-card delay-${Math.min(pidx + 1, 12)}`}
                      style={{ flex: `0 0 ${cardW}`, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
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

                          {/* Botón de Vista Rápida */}
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

                          {/* Badge de Categoría */}
                          {p.categorias?.nombre && (
                            <span style={{
                              position: 'absolute',
                              bottom: '8px',
                              left: '8px',
                              background: 'rgba(15, 23, 42, 0.78)',
                              backdropFilter: 'blur(4px)',
                              color: '#ffffff',
                              fontSize: '10px',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '6px'
                            }}>
                              {p.categorias.nombre}
                            </span>
                          )}
                        </div>

                        <div style={{ padding: '14px 14px 10px' }}>
                          <div
                            onClick={() => navigate(`/producto/${p.id}`)}
                            style={{
                              fontSize: '13.5px',
                              fontWeight: '700',
                              color: '#0f172a',
                              lineHeight: 1.3,
                              marginBottom: '4px',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {p.nombre}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                            Presentación: {p.unidad || 'unidad'}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
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
                              {sinStock ? 'Agotado' : `${p.stock_actual} disp.`}
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
                            padding: '9px 12px',
                            borderRadius: '9px',
                            fontSize: '12px',
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
                          {sinStock ? 'Sin stock' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* ── BANNER PROMOCIONAL YAPE ─────────────────────────────────── */}
        <section style={{ padding: isMobile ? '0 16px 48px' : '0 32px 64px' }}>
          <div className="banner-yape" style={{
            background: 'linear-gradient(120deg, #0f172a 0%, #1e293b 100%)',
            border: '2px solid #F5C100',
            borderRadius: '18px',
            padding: isMobile ? '24px 20px' : '32px 36px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: '24px',
            color: '#ffffff'
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(245, 193, 0, 0.2)',
                color: '#F5C100',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '6px',
                marginBottom: '10px',
                letterSpacing: '0.5px'
              }}>
                COMPRA RÁPIDA SIN COLAS
              </div>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '800', marginBottom: '6px' }}>
                Paga con <span style={{ color: '#F5C100' }}>Yape</span> de forma 100% segura
              </h3>
              <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.5 }}>
                Arma tu pedido en la web, transfiere al <strong style={{ color: '#F5C100' }}>999 888 777</strong> y sube tu comprobante para validación inmediata.
              </p>
            </div>

            <button
              onClick={() => navigate('/productos')}
              className="btn-primary"
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                width: isMobile ? '100%' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Empezar pedido ahora <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
