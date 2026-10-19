import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  Package,
  Smartphone,
  ShieldCheck
} from 'lucide-react'
import { useCarrito } from '../context/CarritoContext'
import { useClienteAuth } from '../context/ClienteAuthContext'
import api from '../services/api'

const YAPE_NUMERO = '999888777'
const YAPE_NOMBRE = 'Ferretería Nasca'
const YAPE_QR_URL = 'https://i.imgur.com/dIOlG6n.jpeg'

const S = { background: '#f8fafc', minHeight: '80vh', color: '#0f172a', fontFamily: "'IBM Plex Sans', sans-serif" }
const card = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }

export function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar, total, totalItems } = useCarrito()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="anim-page" style={{ ...S, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        background: 'rgba(245, 193, 0, 0.16)',
        color: '#b45309',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <ShoppingCart size={40} strokeWidth={1.8} />
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>Tu carrito está vacío</h2>
      <p style={{ color: '#64748b', marginBottom: '26px', fontSize: '14.5px', maxWidth: '380px', lineHeight: 1.5 }}>
        Aún no has agregado materiales ni herramientas. Explora nuestro catálogo actualizado.
      </p>
      <Link to="/productos" className="btn-primary" style={{
        padding: '13px 28px',
        borderRadius: '10px',
        textDecoration: 'none',
        fontWeight: '700',
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        Explorar catálogo <ArrowRight size={16} />
      </Link>
    </div>
  )

  return (
    <div className="anim-page" style={S}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>Carrito de Compras</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Tienes {totalItems} {totalItems === 1 ? 'artículo listo' : 'artículos listos'} para confirmar
            </p>
          </div>
          <button
            onClick={vaciar}
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={14} /> Vaciar carrito
          </button>
        </div>

        <div style={{ ...card, overflow: 'hidden', marginBottom: '20px' }}>
          {items.map((item, i) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '18px 22px',
              borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none',
              flexWrap: 'wrap'
            }}>
              <div
                onClick={() => navigate(`/producto/${item.id}`)}
                style={{
                  width: '68px',
                  height: '68px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
              >
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Package size={28} color="#94a3b8" />
                )}
              </div>

              <div style={{ flex: '1 1 180px' }}>
                <div
                  onClick={() => navigate(`/producto/${item.id}`)}
                  style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', marginBottom: '4px', cursor: 'pointer' }}
                >
                  {item.nombre}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  S/ {parseFloat(item.precio_venta).toFixed(2)} por {item.unidad || 'unidad'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', background: '#f8fafc' }}>
                <button
                  onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                  style={{ padding: '8px 12px', border: 'none', background: 'transparent', color: '#0f172a', cursor: 'pointer', display: 'flex' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 14px', fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>{item.cantidad}</span>
                <button
                  onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                  style={{ padding: '8px 12px', border: 'none', background: 'transparent', color: '#0f172a', cursor: 'pointer', display: 'flex' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '17px', minWidth: '95px', textAlign: 'right' }}>
                S/ {(parseFloat(item.precio_venta) * item.cantidad).toFixed(2)}
              </div>

              <button
                onClick={() => quitar(item.id)}
                title="Quitar producto"
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#dc2626',
                  display: 'flex'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: '22px 26px', marginBottom: '20px', background: '#0f172a', color: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>Total a pagar ({totalItems} productos)</div>
              <div style={{ fontSize: '12px', color: '#F5C100', marginTop: '2px' }}>Incluye impuestos · Recojo en tienda</div>
            </div>
            <span style={{ fontSize: '30px', fontWeight: '800', color: '#F5C100' }}>S/ {total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/productos')}
            style={{
              flex: '1 1 200px',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={16} /> Seguir comprando
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{
              flex: '2 1 260px',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Continuar al pago con Yape <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const { cliente } = useClienteAuth()
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [comprobante, setComprobante] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [venta, setVenta] = useState(null)

  if (items.length === 0 && paso !== 4 && !venta) {
    navigate('/carrito')
    return null
  }

  function handleSelectFile(file) {
    if (!file) return
    setComprobante(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function confirmarPedido() {
    setEnviando(true)
    try {
      const token = localStorage.getItem('cliente_token')
      const { data } = await api.post('/ventas', {
        cliente_id: cliente?.id || null,
        items: items.map(i => ({ producto_id: i.id, cantidad: i.cantidad })),
        canal: 'web',
        metodo_pago: 'yape',
        subtotal: total,
        total,
        notas: `Cliente: ${cliente?.nombre} | Tel: ${cliente?.telefono}`
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      setVenta(data)
      setPaso(2)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear el pedido')
    } finally {
      setEnviando(false)
    }
  }

  async function enviarComprobante() {
    if (!comprobante || !venta) return
    setEnviando(true)
    try {
      const formData = new FormData()
      formData.append('comprobante', comprobante)
      const { data: imgData } = await api.post('/upload/comprobante', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      await api.patch(`/ventas/${venta.id}/estado`, {
        estado: 'pendiente',
        comprobante_url: imgData.url
      })
      vaciar()
      setPaso(4)
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    } finally {
      setEnviando(false)
    }
  }

  const pasosInfo = [
    [1, 'Resumen'],
    [2, 'QR Yape'],
    [3, 'Comprobante'],
    [4, 'Finalizado']
  ]

  return (
    <div className="anim-page" style={{ ...S, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 20px 64px' }}>

      {/* Indicador de Pasos */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
        {pasosInfo.map(([num, label], idx) => {
          const activo = paso === num
          const completado = paso > num
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 13px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                background: activo ? '#0f172a' : completado ? '#dcfce7' : '#e2e8f0',
                color: activo ? '#F5C100' : completado ? '#15803d' : '#64748b'
              }}>
                <span>{completado ? '✓' : num}</span>
                <span>{label}</span>
              </div>
              {idx < pasosInfo.length - 1 && (
                <div style={{ width: '18px', height: '2px', background: completado ? '#22c55e' : '#cbd5e1' }} />
              )}
            </div>
          )
        })}
      </div>

      <div style={{ ...card, padding: '32px', width: '100%', maxWidth: '520px' }}>

        {paso === 1 && (
          <div className="anim-page">
            <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>Confirmar Pedido</h1>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px' }}>
              Hola <strong style={{ color: '#0f172a' }}>{cliente?.nombre}</strong>, verifica el resumen de tus productos antes de generar tu orden.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '22px' }}>
              {items.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#334155', fontWeight: '500' }}>{i.nombre} <strong style={{ color: '#64748b' }}>x{i.cantidad}</strong></span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>S/ {(parseFloat(i.precio_venta) * i.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800' }}>
                <span style={{ fontSize: '15px', color: '#0f172a' }}>TOTAL A PAGAR</span>
                <span style={{ color: '#b45309', fontSize: '22px' }}>S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={confirmarPedido}
              disabled={enviando}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {enviando ? 'Generando pedido...' : <>Confirmar y ver QR Yape <ArrowRight size={17} /></>}
            </button>
          </div>
        )}

        {paso === 2 && (
          <div className="anim-page">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245, 193, 0, 0.18)',
                color: '#b45309',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                <Smartphone size={14} /> PAGO INMEDIATO
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Escanea con Yape</h1>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Escanea el código QR o yapea al número oficial
              </p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                border: '3px solid #F5C100',
                borderRadius: '16px',
                padding: '14px',
                display: 'inline-block',
                background: '#ffffff',
                boxShadow: '0 8px 24px rgba(245, 193, 0, 0.2)'
              }}>
                <img src={YAPE_QR_URL} alt="QR Yape" style={{ width: '185px', height: '185px', borderRadius: '8px', display: 'block' }} />
              </div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '12px 0 2px' }}>
                S/ {(venta ? parseFloat(venta.total) : total).toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Monto exacto a transferir</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px' }}>
              {[
                ['Número Yape', YAPE_NUMERO],
                ['Titular', YAPE_NOMBRE],
                ['Pedido N°', `#${venta?.numero || '—'}`]
              ].map(([k, v], idx) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '7px 0', borderBottom: idx < 2 ? '1px solid #e2e8f0' : 'none' }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>{v}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPaso(3)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '14.5px',
                fontWeight: '700'
              }}
            >
              Ya realicé el pago, adjuntar captura →
            </button>
          </div>
        )}

        {paso === 3 && (
          <div className="anim-page">
            <h1 style={{ fontSize: '21px', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>Adjuntar Comprobante</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Sube la captura de pantalla de tu pago en Yape para validar tu pedido #{venta?.numero}
            </p>

            <div
              onClick={() => document.getElementById('file-input').click()}
              style={{
                border: `2px dashed ${comprobante ? '#16a34a' : '#cbd5e1'}`,
                borderRadius: '14px',
                padding: '28px 20px',
                textAlign: 'center',
                marginBottom: '18px',
                background: comprobante ? '#f0fdf4' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {comprobante ? (
                <div>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Vista previa comprobante"
                      style={{ maxHeight: '160px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #bbf7d0' }}
                    />
                  )}
                  <div style={{ fontWeight: '700', color: '#15803d', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Comprobante listo para enviar
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{comprobante.name} (clic para cambiar)</div>
                </div>
              ) : (
                <div>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    color: '#0f172a'
                  }}>
                    <Upload size={22} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Haz clic para seleccionar tu captura</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Formatos soportados: JPG, PNG, WEBP</div>
                </div>
              )}
              <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleSelectFile(e.target.files[0])} />
            </div>

            <button
              onClick={enviarComprobante}
              disabled={!comprobante || enviando}
              className={comprobante && !enviando ? 'btn-primary' : ''}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                background: !comprobante ? '#e2e8f0' : '#F5C100',
                color: !comprobante ? '#94a3b8' : '#0f172a',
                fontSize: '14.5px',
                fontWeight: '700',
                cursor: !comprobante || enviando ? 'not-allowed' : 'pointer'
              }}
            >
              {enviando ? 'Subiendo comprobante...' : 'Enviar comprobante y finalizar'}
            </button>
          </div>
        )}

        {paso === 4 && (
          <div className="anim-page" style={{ textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={38} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>¡Pedido Registrado con Éxito!</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '22px', lineHeight: 1.5 }}>
              Hemos recibido tu comprobante. Nuestro equipo validará tu pago y preparará tus materiales para despacho.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '22px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#b45309', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} /> Próximos pasos
              </div>
              {[
                'Verificamos tu transferencia Yape en minutos.',
                'Preparamos tu orden en el almacén de Jr. Lima 123.',
                'Puedes revisar el estado en tiempo real desde "Mis Pedidos".'
              ].map((s, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#334155', marginBottom: '6px', display: 'flex', gap: '8px' }}>
                  <strong style={{ color: '#b45309' }}>{i + 1}.</strong>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <Link to="/mis-pedidos" className="btn-primary" style={{
              display: 'block',
              padding: '13px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              Ir a Mis Pedidos
            </Link>
            <button onClick={() => navigate('/')} style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
