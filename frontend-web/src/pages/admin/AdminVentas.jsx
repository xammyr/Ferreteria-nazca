import { useState, useEffect } from 'react'
import { X, Eye, Check, Truck, Clock, CheckCircle2, FileText, ShoppingBag } from 'lucide-react'
import api from '../../services/api'
import { useSearchParams } from 'react-router-dom'

const estados = {
  pendiente:  { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Pendiente', icon: <Clock size={13} /> },
  pagado:     { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Pagado', icon: <CheckCircle2 size={13} /> },
  despachado: { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', label: 'Despachado', icon: <Truck size={13} /> },
  cancelado:  { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Cancelado', icon: <X size={13} /> },
}

export default function AdminVentas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalImg, setModalImg] = useState(null)
  const [accionandoId, setAccionandoId] = useState(null)
  const estadoFiltro = searchParams.get('estado') || ''

  function cargarVentas() {
    setCargando(true)
    api.get('/ventas', { params: { estado: estadoFiltro || undefined, limit: 50 } })
      .then(r => setVentas(r.data.ventas || []))
      .catch(console.error)
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarVentas()
  }, [estadoFiltro])

  async function handleCambiarEstado(id, nuevoEstado) {
    if (!window.confirm(`¿Seguro que deseas cambiar este pedido a "${nuevoEstado}"?`)) return
    setAccionandoId(id)
    try {
      await api.patch(`/ventas/${id}/estado`, { estado: nuevoEstado })
      cargarVentas()
    } catch (err) {
      alert('Error al actualizar estado: ' + (err.response?.data?.error || err.message))
    } finally {
      setAccionandoId(null)
    }
  }

  return (
    <div className="anim-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Gestión de Pedidos & Ventas</h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Validación de pagos por Yape y control de despacho</p>
        </div>

        {/* Filtros de Estado */}
        <div style={{ display: 'flex', gap: '6px', background: '#ffffff', padding: '5px', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          {[
            { key: '', label: 'Todos' },
            { key: 'pendiente', label: 'Pendientes' },
            { key: 'pagado', label: 'Pagados' },
            { key: 'despachado', label: 'Despachados' },
            { key: 'cancelado', label: 'Cancelados' },
          ].map(f => {
            const activo = estadoFiltro === f.key
            return (
              <button
                key={f.key}
                onClick={() => setSearchParams(f.key ? { estado: f.key } : {})}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: activo ? '700' : '600',
                  background: activo ? '#F5C100' : 'transparent',
                  color: activo ? '#0f172a' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {cargando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="skeleton" style={{ height: '140px', borderRadius: '14px' }} />
          ))}
        </div>
      ) : ventas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <ShoppingBag size={36} style={{ marginBottom: '10px', color: '#94a3b8' }} />
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>No hay pedidos en este estado</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ventas.map((v, idx) => {
            const est = estados[v.estado] || estados.pendiente
            const esPendiente = v.estado === 'pendiente'

            return (
              <div
                key={v.id}
                className={`anim-section delay-${Math.min((idx % 10) + 1, 10)}`}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  borderRadius: '14px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>#{v.numero}</span>
                    <span style={{
                      padding: '4px 11px',
                      borderRadius: '20px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      background: est.bg,
                      color: est.color,
                      border: `1px solid ${est.border}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {est.icon} {est.label}
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                      {new Date(v.creado_en).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '600', background: '#f1f5f9', padding: '3px 9px', borderRadius: '6px', color: '#475569', textTransform: 'uppercase' }}>
                      Canal: {v.canal}
                    </span>
                  </div>

                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                    S/ {parseFloat(v.total).toFixed(2)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  {/* Datos del Cliente y Notas */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Cliente / Contacto
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.45 }}>
                      {v.clientes ? (
                        <>
                          <strong style={{ color: '#0f172a' }}>{v.clientes.nombre}</strong> ({v.clientes.telefono || 'Sin teléfono'})<br />
                          <span style={{ color: '#64748b', fontSize: '12.5px' }}>{v.clientes.email} · {v.clientes.direccion || 'Sin dirección'}</span>
                        </>
                      ) : (
                        <span>Venta en Tienda (Presencial)</span>
                      )}
                    </div>
                    {v.notas && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FileText size={13} /> {v.notas}
                      </div>
                    )}
                  </div>

                  {/* Ítems comprados */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Detalle de Productos
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {v.venta_items?.map(it => (
                        <div key={it.id} style={{ fontSize: '13px', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                          <span>• {it.nombre_producto} <strong style={{ color: '#64748b' }}>x{it.cantidad}</strong></span>
                          <span style={{ color: '#0f172a', fontWeight: '600' }}>S/ {parseFloat(it.subtotal).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Barra de Acciones y Comprobante */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '14px'
                }}>
                  <div>
                    {v.comprobante_url ? (
                      <button
                        onClick={() => setModalImg(v.comprobante_url)}
                        style={{
                          background: 'rgba(245, 193, 0, 0.16)',
                          border: '1px solid rgba(245, 193, 0, 0.45)',
                          color: '#0f172a',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={15} color="#b45309" /> Ver Comprobante Yape
                      </button>
                    ) : (
                      <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>Sin comprobante adjunto</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {esPendiente && (
                      <button
                        disabled={accionandoId === v.id}
                        onClick={() => handleCambiarEstado(v.id, 'pagado')}
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Check size={15} /> Aprobar Pago
                      </button>
                    )}

                    {v.estado === 'pagado' && (
                      <button
                        disabled={accionandoId === v.id}
                        onClick={() => handleCambiarEstado(v.id, 'despachado')}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Truck size={15} /> Marcar Despachado
                      </button>
                    )}

                    {v.estado !== 'cancelado' && v.estado !== 'despachado' && (
                      <button
                        disabled={accionandoId === v.id}
                        onClick={() => handleCambiarEstado(v.id, 'cancelado')}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          padding: '7px 13px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal para ver comprobante a pantalla completa */}
      {modalImg && (
        <div
          className="anim-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setModalImg(null)}
        >
          <div className="anim-modal-content" style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
            <img src={modalImg} alt="Comprobante Yape" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '14px', boxShadow: '0 20px 48px rgba(0,0,0,0.6)' }} />
            <button
              onClick={() => setModalImg(null)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                background: '#F5C100',
                color: '#0f172a',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontWeight: '800',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
