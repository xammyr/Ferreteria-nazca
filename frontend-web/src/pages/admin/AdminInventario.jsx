import { useState, useEffect } from 'react'
import { Search, Package, X, PlusCircle, MinusCircle } from 'lucide-react'
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
    <div className="anim-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Control de Inventario & Stock</h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Monitoreo de existencias y registro de entradas o salidas de almacén</p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '0 12px',
          width: '300px'
        }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          {buscar && (
            <button onClick={() => setBuscar('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {cargando ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="skeleton" style={{ height: '42px', width: '100%' }} />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          No se encontraron productos con ese criterio.
        </div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', borderRadius: '14px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F5C100', background: '#0f172a', color: '#ffffff' }}>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Código</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Producto</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Categoría</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Unidad</th>
                <th style={{ padding: '14px 16px', fontWeight: '700' }}>P. Venta</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '700' }}>Stock Actual</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '700' }}>Mínimo</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '700' }}>Estado</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => {
                const sinStock = p.stock_actual <= 0
                const stockBajo = !sinStock && p.stock_actual <= (p.stock_minimo || 5)

                return (
                  <tr key={p.id} className="admin-table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#b45309' }}>{p.codigo}</td>
                    <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {p.imagen_url ? (
                            <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Package size={16} color="#94a3b8" />
                          )}
                        </div>
                        <span>{p.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.categorias?.nombre || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.unidad || 'unidad'}</td>
                    <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: '700' }}>S/ {parseFloat(p.precio_venta).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '800', fontSize: '14.5px', color: sinStock ? '#dc2626' : stockBajo ? '#d97706' : '#16a34a' }}>
                      {p.stock_actual}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: '#64748b' }}>{p.stock_minimo || 5}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: sinStock ? '#fef2f2' : stockBajo ? '#fffbeb' : '#f0fdf4',
                        color: sinStock ? '#dc2626' : stockBajo ? '#d97706' : '#16a34a',
                        border: `1px solid ${sinStock ? '#fecaca' : stockBajo ? '#fde68a' : '#bbf7d0'}`
                      }}>
                        {sinStock ? 'SIN STOCK' : stockBajo ? 'STOCK BAJO' : 'ÓPTIMO'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setModalProd(p)}
                        className="btn-primary"
                        style={{
                          padding: '7px 13px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700'
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

      {/* Modal para Ajustar Stock (Tema Claro Industrial) */}
      {modalProd && (
        <div
          className="anim-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setModalProd(null)}
        >
          <div
            className="anim-modal-content"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.25)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                  Ajustar Stock
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  {modalProd.nombre} · Actual: <strong style={{ color: '#0f172a' }}>{modalProd.stock_actual} {modalProd.unidad}</strong>
                </p>
              </div>
              <button
                onClick={() => setModalProd(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#475569', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRegistrarMovimiento} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Tipo de Movimiento
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setTipoMov('entrada')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: tipoMov === 'entrada' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: tipoMov === 'entrada' ? '#f0fdf4' : '#f8fafc',
                      color: tipoMov === 'entrada' ? '#15803d' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <PlusCircle size={16} /> Entrada (Compra)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoMov('salida')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: tipoMov === 'salida' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                      background: tipoMov === 'salida' ? '#fef2f2' : '#f8fafc',
                      color: tipoMov === 'salida' ? '#dc2626' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MinusCircle size={16} /> Salida / Ajuste
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Cantidad a {tipoMov === 'entrada' ? 'ingresar' : 'retirar'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                  required
                  className="input-modern"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '14px',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Motivo / Referencia
                </label>
                <input
                  type="text"
                  placeholder="Ej: Guía de remisión #402, reposición de almacén..."
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                  className="input-modern"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setModalProd(null)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '13.5px'
                  }}
                >
                  {enviando ? 'Guardando...' : 'Confirmar Movimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
