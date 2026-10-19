import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, CheckCircle2, Truck, XCircle, Upload, ExternalLink, Package, ArrowRight } from 'lucide-react'
import api from '../services/api'
import { useClienteAuth } from '../context/ClienteAuthContext'

const estados = {
  pendiente:  { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Pendiente de validación', icon: <Clock size={14} /> },
  pagado:     { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Pago confirmado', icon: <CheckCircle2 size={14} /> },
  despachado: { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', label: 'Despachado / Listo', icon: <Truck size={14} /> },
  cancelado:  { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Cancelado', icon: <XCircle size={14} /> },
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
      const formData = new FormData()
      formData.append('comprobante', file)
      const { data: imgData } = await api.post('/upload/comprobante', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      await api.patch(`/clientes/pedidos/${pedidoId}/comprobante`, {
        comprobante_url: imgData.url
      })

      cargarPedidos()
    } catch (err) {
      alert('Error al subir comprobante: ' + (err.response?.data?.error || err.message))
    } finally {
      setSubiendoId(null)
    }
  }

  return (
    <div className="anim-page" style={{ background: '#f8fafc', minHeight: '80vh', color: '#0f172a', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px 64px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>Mis Pedidos</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>
          Hola <strong style={{ color: '#0f172a' }}>{cliente?.nombre}</strong>, consulta el estado y seguimiento de tus compras.
        </p>

        {cargando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '12px' }} />
                <div className="skeleton" style={{ height: '50px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : pedidos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            color: '#64748b'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#94a3b8'
            }}>
              <Package size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Aún no tienes pedidos registrados</h3>
            <p style={{ fontSize: '13.5px', marginBottom: '22px' }}>Realiza tu primera compra online y haz seguimiento desde aquí.</p>
            <Link to="/productos" className="btn-primary" style={{
              padding: '12px 26px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Ir al catálogo <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pedidos.map((p, idx) => {
              const est = estados[p.estado] || estados.pendiente
              const tieneComprobante = !!p.comprobante_url

              return (
                <div
                  key={p.id}
                  className={`anim-section delay-${Math.min(idx + 1, 10)}`}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '22px 24px',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '16.5px', color: '#0f172a' }}>Pedido #{p.numero}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {new Date(p.creado_en).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: est.bg,
                        color: est.color,
                        border: `1px solid ${est.border}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {est.icon} {est.label}
                      </span>
                      <span style={{ fontSize: '21px', fontWeight: '800', color: '#0f172a' }}>
                        S/ {parseFloat(p.total).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
                      Detalle de artículos:
                    </div>
                    {p.venta_items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#334155', marginBottom: '6px' }}>
                        <span>• {item.nombre_producto} <strong style={{ color: '#64748b' }}>x{item.cantidad}</strong></span>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>S/ {parseFloat(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Estado del Comprobante */}
                  {p.estado === 'pendiente' && (
                    <div style={{
                      marginTop: '14px',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '12.5px', color: '#b45309', fontWeight: '600' }}>
                        {tieneComprobante
                          ? 'Comprobante enviado. Nuestro equipo lo está verificando.'
                          : 'Pendiente de comprobante Yape. Adjunta tu captura aquí:'}
                      </div>
                      {tieneComprobante ? (
                        <a
                          href={p.comprobante_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          Ver comprobante <ExternalLink size={13} />
                        </a>
                      ) : (
                        <label className="btn-primary" style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: subiendoId === p.id ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Upload size={14} />
                          {subiendoId === p.id ? 'Subiendo...' : 'Adjuntar captura'}
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
                  )}

                  {p.estado === 'pagado' && (
                    <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={15} /> Pago verificado por Ferretería Nasca. Estamos alistando tu pedido.
                    </div>
                  )}

                  {p.estado === 'despachado' && (
                    <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#0284c7', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={15} /> Pedido despachado / listo para recojo en Jr. Lima 123.
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
