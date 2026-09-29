import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useSearchParams } from 'react-router-dom'

const estados = {
  pendiente:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: '⏳ Pendiente' },
  pagado:     { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  label: '✅ Pagado' },
  despachado: { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', label: '🚚 Despachado' },
  cancelado:  { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  label: '❌ Cancelado' },
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>Gestión de Pedidos & Ventas</h1>
          <p style={{ fontSize: '13px', color: '#777', margin: 0 }}>Validación de pagos Yape y despacho de mercadería</p>
        </div>

        {/* Filtros de Estado */}
        <div style={{ display: 'flex', gap: '6px', background: '#141414', padding: '4px', borderRadius: '8px', border: '1px solid #282828' }}>
          {[
            { key: '', label: 'Todos' },
            { key: 'pendiente', label: '⏳ Pendientes' },
            { key: 'pagado', label: '✅ Pagados' },
            { key: 'despachado', label: '🚚 Despachados' },
            { key: 'cancelado', label: '❌ Cancelados' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setSearchParams(f.key ? { estado: f.key } : {})}
              style={{
                padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                background: estadoFiltro === f.key ? '#F5C100' : 'transparent',
                color: estadoFiltro === f.key ? '#0a0a0a' : '#888',
                border: 'none', cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '60px', fontSize: '28px' }}>⏳ Cargando pedidos...</div>
      ) : ventas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#141414', borderRadius: '10px', color: '#666' }}>
          No hay pedidos en este estado.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ventas.map(v => {
            const est = estados[v.estado] || estados.pendiente
            const esPendiente = v.estado === 'pendiente'

            return (
              <div key={v.id} style={{
                background: '#141414', border: '1px solid #242424', borderRadius: '10px', padding: '18px 20px',
                display: 'flex', flexDirection: 'column', gap: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>#{v.numero}</span>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: est.bg, color: est.color }}>
                      {est.label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(v.creado_en).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontSize: '11px', background: '#1e1e1e', padding: '2px 8px', borderRadius: '4px', color: '#888' }}>
                      Canal: {v.canal}
                    </span>
                  </div>

                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#F5C100' }}>
                    S/ {parseFloat(v.total).toFixed(2)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', borderTop: '1px solid #202020', paddingTop: '12px' }}>
                  {/* Datos del Cliente y Notas */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', marginBottom: '4px' }}>Cliente / Contacto</div>
                    <div style={{ fontSize: '13px', color: '#ddd' }}>
                      {v.clientes ? (
                        <>
                          <strong>{v.clientes.nombre}</strong> ({v.clientes.telefono || 'Sin teléfono'})<br />
                          <span style={{ color: '#888', fontSize: '12px' }}>{v.clientes.email} | {v.clientes.direccion || 'Sin dirección'}</span>
                        </>
                      ) : (
                        <span>Venta en Tienda (Presencial)</span>
                      )}
                    </div>
                    {v.notas && <div style={{ fontSize: '12px', color: '#999', marginTop: '6px', fontStyle: 'italic' }}>📝 {v.notas}</div>}
                  </div>

                  {/* Ítems comprados */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', marginBottom: '4px' }}>Detalle de Productos</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {v.venta_items?.map(it => (
                        <div key={it.id} style={{ fontSize: '12.5px', color: '#bbb', display: 'flex', justifyContent: 'space-between' }}>
                          <span>• {it.nombre_producto} <strong>x{it.cantidad}</strong></span>
                          <span style={{ color: '#888' }}>S/ {parseFloat(it.subtotal).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Barra de Acciones y Comprobante */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
                  borderTop: '1px solid #202020', paddingTop: '12px'
                }}>
                  <div>
                    {v.comprobante_url ? (
                      <button
                        onClick={() => setModalImg(v.comprobante_url)}
                        style={{
                          background: 'rgba(245,193,0,0.1)', border: '1px solid rgba(245,193,0,0.3)', color: '#F5C100',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        👁️ Ver Comprobante Yape
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#666' }}>Sin comprobante adjunto</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {esPendiente && (
                      <button
                        disabled={accionandoId === v.id}
                        onClick={() => handleCambiarEstado(v.id, 'pagado')}
                        style={{
                          background: '#22c55e', color: '#0a0a0a', border: 'none', padding: '7px 14px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        ✓ Aprobar Pago
                      </button>
                    )}

                    {v.estado === 'pagado' && (
                      <button
                        disabled={accionandoId === v.id}
                        onClick={() => handleCambiarEstado(v.id, 'despachado')}
                        style={{
                          background: '#38bdf8', color: '#0a0a0a', border: 'none', padding: '7px 14px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        🚚 Despachar
                      </button>
                    )}

                    {v.estado !== 'cancelado' && v.estado !== 'despachado' && (
                      <button
                        disabled={accionandoId === v.id}
                        onClick={() => handleCambiarEstado(v.id, 'cancelado')}
                        style={{
                          background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
                        }}
                      >
                        ✕ Cancelar
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
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setModalImg(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
            <img src={modalImg} alt="Comprobante Yape" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }} />
            <button
              onClick={() => setModalImg(null)}
              style={{
                position: 'absolute', top: '-12px', right: '-12px', background: '#F5C100', color: '#0a0a0a',
                border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontWeight: '700', fontSize: '16px', cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
