import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AdminInventario() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [buscar, setBuscar] = useState('')
  const [modalProd, setModalProd] = useState(null)
  const [tipoMov, setTipoMov] = useState('entrada')
  const [cantidad, setCantidad] = useState(1)
  const [referencia, setReferencia] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cargarProductos() {
    setCargando(true)
    api.get('/productos', { params: { buscar: buscar || undefined, limit: 100 } })
      .then(r => setProductos(r.data.productos || []))
      .catch(console.error)
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarProductos()
  }, [buscar])

  async function handleRegistrarMovimiento(e) {
    e.preventDefault()
    if (!modalProd || cantidad <= 0) return
    setEnviando(true)
    try {
      await api.post('/inventario/movimiento', {
        producto_id: modalProd.id,
        tipo: tipoMov,
        cantidad: parseInt(cantidad),
        referencia: referencia || `Ajuste manual ${tipoMov}`
      })
      alert('¡Movimiento de inventario registrado con éxito!')
      setModalProd(null)
      setCantidad(1)
      setReferencia('')
      cargarProductos()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>Control de Inventario & Stock</h1>
          <p style={{ fontSize: '13px', color: '#777', margin: 0 }}>Monitoreo de existencias y registro de entradas/salidas</p>
        </div>

        <input
          type="text"
          placeholder="Buscar producto por nombre o código..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
          style={{
            padding: '9px 14px', background: '#141414', border: '1px solid #333', borderRadius: '8px',
            color: '#fff', fontSize: '13px', outline: 'none', width: '280px'
          }}
        />
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '60px', fontSize: '28px' }}>⏳ Cargando inventario...</div>
      ) : productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#141414', borderRadius: '10px', color: '#666' }}>
          No se encontraron productos.
        </div>
      ) : (
        <div style={{ background: '#141414', border: '1px solid #242424', borderRadius: '10px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #282828', background: '#181818', color: '#888' }}>
                <th style={{ padding: '12px 16px' }}>Código</th>
                <th style={{ padding: '12px 16px' }}>Producto</th>
                <th style={{ padding: '12px 16px' }}>Categoría</th>
                <th style={{ padding: '12px 16px' }}>Unidad</th>
                <th style={{ padding: '12px 16px' }}>P. Venta</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Stock Actual</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Mínimo</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => {
                const sinStock = p.stock_actual <= 0
                const stockBajo = !sinStock && p.stock_actual <= (p.stock_minimo || 5)

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #1f1f1f' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#F5C100' }}>{p.codigo}</td>
                    <td style={{ padding: '12px 16px', color: '#fff', fontWeight: '500' }}>{p.nombre}</td>
                    <td style={{ padding: '12px 16px', color: '#aaa' }}>{p.categorias?.nombre || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#888' }}>{p.unidad || 'unidad'}</td>
                    <td style={{ padding: '12px 16px', color: '#ddd' }}>S/ {parseFloat(p.precio_venta).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', fontSize: '14px', color: sinStock ? '#ef4444' : stockBajo ? '#f59e0b' : '#22c55e' }}>
                      {p.stock_actual}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: '#777' }}>{p.stock_minimo || 5}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                        background: sinStock ? 'rgba(239,68,68,0.1)' : stockBajo ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                        color: sinStock ? '#ef4444' : stockBajo ? '#f59e0b' : '#22c55e'
                      }}>
                        {sinStock ? 'SIN STOCK' : stockBajo ? 'STOCK BAJO' : 'OK'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setModalProd(p)}
                        style={{
                          background: '#1f1f1f', border: '1px solid #333', color: '#F5C100', padding: '6px 12px',
                          borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        ± Ajustar Stock
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Ajustar Stock */}
      {modalProd && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setModalProd(null)}>
          <div style={{
            background: '#161616', border: '1px solid #2e2e2e', borderRadius: '12px', padding: '24px',
            maxWidth: '440px', width: '100%', boxShadow: '0 8px 30px rgba(0,0,0,0.7)'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>
              Ajustar Inventario: {modalProd.nombre}
            </h2>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 18px 0' }}>
              Stock actual: <strong style={{ color: '#F5C100' }}>{modalProd.stock_actual} {modalProd.unidad}</strong>
            </p>

            <form onSubmit={handleRegistrarMovimiento} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Tipo de Movimiento</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setTipoMov('entrada')}
                    style={{
                      flex: 1, padding: '9px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      border: tipoMov === 'entrada' ? '2px solid #22c55e' : '1px solid #333',
                      background: tipoMov === 'entrada' ? 'rgba(34,197,94,0.1)' : '#1f1f1f',
                      color: tipoMov === 'entrada' ? '#22c55e' : '#aaa'
                    }}
                  >
                    + Entrada (Compra)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoMov('salida')}
                    style={{
                      flex: 1, padding: '9px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      border: tipoMov === 'salida' ? '2px solid #ef4444' : '1px solid #333',
                      background: tipoMov === 'salida' ? 'rgba(239,68,68,0.1)' : '#1f1f1f',
                      color: tipoMov === 'salida' ? '#ef4444' : '#aaa'
                    }}
                  >
                    - Salida (Merma / Ajuste)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#1c1c1c',
                    border: '1px solid #333', borderRadius: '6px', color: '#fff', fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>Motivo / Referencia</label>
                <input
                  type="text"
                  placeholder="Ej: Factura de proveedor #402, corrección de inventario..."
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#1c1c1c',
                    border: '1px solid #333', borderRadius: '6px', color: '#fff', fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalProd(null)}
                  style={{ padding: '8px 14px', borderRadius: '6px', background: 'transparent', border: '1px solid #333', color: '#888', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  style={{
                    padding: '8px 18px', borderRadius: '6px', background: '#F5C100', color: '#0a0a0a',
                    border: 'none', fontWeight: '700', fontSize: '13px', cursor: enviando ? 'wait' : 'pointer'
                  }}
                >
                  {enviando ? 'Guardando...' : 'Confirmar Ajuste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
