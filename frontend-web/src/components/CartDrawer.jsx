import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle2, Package, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function CartDrawer() {
  const {
    items,
    quitar,
    cambiarCantidad,
    vaciar,
    total,
    totalItems,
    drawerAbierto,
    setDrawerAbierto,
    toast,
    cerrarToast
  } = useCarrito()
  const navigate = useNavigate()

  function irA(ruta) {
    setDrawerAbierto(false)
    navigate(ruta)
  }

  return (
    <>
      {/* Botón flotante de WhatsApp con pulso */}
      <a
        href="https://wa.me/51999888777?text=Hola%20Ferreter%C3%ADa%20Nasca,%20quisiera%20consultar%20por%20unos%20productos"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        title="Consultar por WhatsApp"
      >
        <MessageCircle size={28} strokeWidth={2.2} />
      </a>

      {/* Toast animado al agregar producto */}
      {toast && !drawerAbierto && (
        <div
          key={toast.id}
          className="anim-toast"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 250,
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '14px',
            padding: '14px 18px',
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(245, 193, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            maxWidth: '380px',
            width: 'calc(100vw - 100px)'
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#ffffff',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {toast.producto.imagen_url ? (
              <img src={toast.producto.imagen_url} alt={toast.producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Package size={22} color="#0f172a" />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#F5C100', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
              <CheckCircle2 size={13} /> Agregado al carrito
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {toast.cantidad}x {toast.producto.nombre}
            </div>
          </div>

          <button
            onClick={() => {
              cerrarToast()
              setDrawerAbierto(true)
            }}
            style={{
              background: '#F5C100',
              color: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Ver carrito
          </button>

          <button
            onClick={cerrarToast}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Drawer lateral del Carrito */}
      {drawerAbierto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          {/* Backdrop */}
          <div
            className="anim-modal-backdrop"
            onClick={() => setDrawerAbierto(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(3px)'
            }}
          />

          {/* Panel lateral */}
          <div
            className="anim-drawer-right"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '420px',
              background: '#ffffff',
              boxShadow: '-12px 0 36px rgba(15, 23, 42, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1
            }}
          >
            {/* Header del Drawer */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '2px solid #F5C100',
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: '#F5C100',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingCart size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', lineHeight: 1.1 }}>Tu Carrito</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    {totalItems} {totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDrawerAbierto(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Lista de items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
              {items.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: '#64748b',
                  padding: '32px 16px'
                }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: '#94a3b8'
                  }}>
                    <ShoppingCart size={34} />
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                    Tu carrito está vacío
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '22px', lineHeight: 1.5 }}>
                    Explora nuestro catálogo de herramientas, materiales de construcción y acabados.
                  </p>
                  <button
                    onClick={() => irA('/productos')}
                    className="btn-primary"
                    style={{
                      padding: '11px 22px',
                      borderRadius: '10px',
                      fontSize: '13px'
                    }}
                  >
                    Explorar catálogo →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        onClick={() => irA(`/producto/${item.id}`)}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '10px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {item.imagen_url ? (
                          <img src={item.imagen_url} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={24} color="#94a3b8" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          onClick={() => irA(`/producto/${item.id}`)}
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#0f172a',
                            marginBottom: '2px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {item.nombre}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                          S/ {parseFloat(item.precio_venta).toFixed(2)} / {item.unidad || 'und'}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}>
                            <button
                              onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                              style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#334155', display: 'flex' }}
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ padding: '2px 10px', fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                              style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#334155', display: 'flex' }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                            S/ {(parseFloat(item.precio_venta) * item.cantidad).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => quitar(item.id)}
                        title="Eliminar"
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: 'none',
                          color: '#ef4444',
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer del Drawer */}
            {items.length > 0 && (
              <div style={{
                padding: '18px 22px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Subtotal ({totalItems} ítems)</span>
                  <button
                    onClick={vaciar}
                    style={{ background: 'none', border: 'none', fontSize: '11px', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Vaciar todo
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Total estimado</span>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
                    S/ {total.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => irA('/checkout')}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Pagar rápido con Yape <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => irA('/carrito')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: '#ffffff',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    Ver carrito detallado
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
