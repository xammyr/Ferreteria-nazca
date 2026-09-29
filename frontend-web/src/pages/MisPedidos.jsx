import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useClienteAuth } from '../context/ClienteAuthContext'

const estados = {
  pendiente:  { color: '#EF9F27', bg: 'rgba(239,159,39,0.1)', label: '⏳ Pendiente' },
  pagado:     { color: '#5a9e30', bg: 'rgba(90,158,48,0.1)',  label: '✅ Pagado' },
  despachado: { color: '#378ADD', bg: 'rgba(55,138,221,0.1)', label: '🚚 Despachado' },
  cancelado:  { color: '#E24B4A', bg: 'rgba(226,75,74,0.1)',  label: '❌ Cancelado' },
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [subiendoId, setSubiendoId] = useState(null)
  const { cliente } = useClienteAuth()

  function cargarPedidos() {
    api.get('/clientes/pedidos')
      .then(r => setPedidos(r.data))
      .catch(console.error)
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  async function handleSubirComprobante(pedidoId, file) {
    if (!file) return
    setSubiendoId(pedidoId)
    try {
      // 1. Subir imagen
      const formData = new FormData()
      formData.append('comprobante', file)
      const { data: imgData } = await api.post('/upload/comprobante', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // 2. Adjuntar a pedido
      await api.patch(`/clientes/pedidos/${pedidoId}/comprobante`, {
        comprobante_url: imgData.url
      })

      alert('¡Comprobante adjuntado correctamente! Nuestro personal lo verificará a la brevedad.')
      cargarPedidos()
    } catch (err) {
      alert('Error al subir comprobante: ' + (err.response?.data?.error || err.message))
    } finally {
      setSubiendoId(null)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '6px' }}>📦 Mis Pedidos</h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '28px' }}>Hola {cliente?.nombre}, aquí están tus pedidos.</p>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '60px', fontSize: '32px' }}>⏳</div>
        ) : pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ marginBottom: '20px' }}>Aún no tienes pedidos.</p>
            <Link to="/productos" style={{
              padding: '12px 28px', background: '#F5C100', color: '#0a0a0a',
              borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px'
            }}>Ver productos</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pedidos.map(p => {
              const est = estados[p.estado] || estados.pendiente
              const tieneComprobante = !!p.comprobante_url

              return (
                <div key={p.id} style={{
                  background: '#1a1a1a', border: '0.5px solid #2a2a2a',
                  borderRadius: '12px', padding: '20px 24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: '#fff' }}>Pedido #{p.numero}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        {new Date(p.creado_en).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                        background: est.bg, color: est.color
                      }}>{est.label}</span>
                      <span style={{ fontSize: '20px', fontWeight: '600', color: '#F5C100' }}>
                        S/ {parseFloat(p.total).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '0.5px solid #282828', paddingTop: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Productos:</div>
                    {p.venta_items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#bbb', marginBottom: '5px' }}>
                        <span>• {item.nombre_producto} <strong style={{ color: '#888' }}>x{item.cantidad}</strong></span>
                        <span style={{ color: '#ddd' }}>S/ {parseFloat(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Estado del Comprobante y opciones de subida */}
                  {p.estado === 'pendiente' && (
                    <div style={{ marginTop: '12px', background: 'rgba(239,159,39,0.06)', border: '0.5px solid rgba(239,159,39,0.2)', borderRadius: '8px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ fontSize: '12.5px', color: '#EF9F27' }}>
                          {tieneComprobante ? '⏳ Comprobante adjuntado. Nuestro equipo lo está verificando.' : '⚠️ Aún no has adjuntado tu comprobante de Yape.'}
                        </div>
                        {tieneComprobante ? (
                          <a href={p.comprobante_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#F5C100', textDecoration: 'underline' }}>
                            Ver comprobante enviado ↗
                          </a>
                        ) : (
                          <label style={{
                            padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                            background: '#F5C100', color: '#0a0a0a', cursor: subiendoId === p.id ? 'wait' : 'pointer'
                          }}>
                            {subiendoId === p.id ? 'Subiendo...' : '📎 Adjuntar Comprobante'}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={subiendoId === p.id}
                              onChange={e => handleSubirComprobante(p.id, e.target.files[0])}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {p.estado === 'pagado' && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#5a9e30', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✅ Pago confirmado por Ferretería Nazca. Tu pedido está siendo preparado.</span>
                    </div>
                  )}

                  {p.estado === 'despachado' && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#378ADD', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🚚 Tu pedido ya fue despachado o está listo para recojo en tienda.</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
