import { useState, useEffect } from 'react'
import { X, ShoppingCart, Plus, Minus, ExternalLink, Package, CheckCircle2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function QuickViewModal() {
  const { quickViewProducto: prod, setQuickViewProducto, agregar } = useCarrito()
  const [cantidad, setCantidad] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    setCantidad(1)
  }, [prod])

  if (!prod) return null

  const sinStock = (prod.stock_actual ?? 0) <= 0

  function handleAgregar() {
    agregar(prod, cantidad)
    setQuickViewProducto(null)
  }

  function irADetalle() {
    const id = prod.id
    setQuickViewProducto(null)
    navigate(`/producto/${id}`)
  }

  return (
    <div
      className="anim-modal-backdrop"
      onClick={() => setQuickViewProducto(null)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 350,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="anim-modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          maxWidth: '720px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.3)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 680 ? '1fr' : '1fr 1.1fr'
        }}
      >
        <button
          onClick={() => setQuickViewProducto(null)}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.08)',
            border: 'none',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Imagen */}
        <div style={{
          background: '#f8fafc',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          borderRight: window.innerWidth < 680 ? 'none' : '1px solid #f1f5f9',
          borderBottom: window.innerWidth < 680 ? '1px solid #f1f5f9' : 'none',
          position: 'relative'
        }}>
          {prod.imagen_url ? (
            <img
              src={prod.imagen_url}
              alt={prod.nombre}
              style={{
                maxWidth: '100%',
                maxHeight: '260px',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          ) : (
            <Package size={72} color="#94a3b8" strokeWidth={1.2} />
          )}

          {prod.codigo && (
            <span style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#F5C100',
              fontSize: '11px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              CÓD: {prod.codigo}
            </span>
          )}
        </div>

        {/* Detalles */}
        <div style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: '#b45309',
              background: 'rgba(245, 193, 0, 0.2)',
              padding: '4px 10px',
              borderRadius: '6px',
              marginBottom: '10px'
            }}>
              {prod.categorias?.nombre || 'Ferretería General'}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', lineHeight: 1.25, marginBottom: '8px' }}>
              {prod.nombre}
            </h2>

            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55, marginBottom: '16px' }}>
              {prod.descripcion || `Producto de alta resistencia disponible por ${prod.unidad || 'unidad'} en nuestra tienda de Nasca.`}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
                S/ {parseFloat(prod.precio_venta).toFixed(2)}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                por {prod.unidad || 'unidad'}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                padding: '5px 12px',
                borderRadius: '20px',
                background: sinStock ? '#fef2f2' : '#f0fdf4',
                color: sinStock ? '#dc2626' : '#16a34a',
                border: `1px solid ${sinStock ? '#fecaca' : '#bbf7d0'}`
              }}>
                {sinStock ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                {sinStock ? 'Agotado temporalmente' : `${prod.stock_actual} disponibles para entrega inmediata`}
              </span>
            </div>
          </div>

          <div>
            {!sinStock && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    style={{ padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#0f172a', display: 'flex' }}
                  >
                    <Minus size={15} />
                  </button>
                  <span style={{ padding: '0 12px', fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                    {cantidad}
                  </span>
                  <button
                    onClick={() => setCantidad(Math.min(prod.stock_actual, cantidad + 1))}
                    style={{ padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', color: '#0f172a', display: 'flex' }}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  onClick={handleAgregar}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <ShoppingCart size={17} /> Agregar al carrito
                </button>
              </div>
            )}

            <button
              onClick={irADetalle}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              Ver página completa del producto <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
