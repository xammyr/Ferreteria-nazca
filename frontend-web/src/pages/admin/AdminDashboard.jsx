import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/ventas/resumen')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return <div style={{ textAlign: 'center', padding: '80px', fontSize: '28px' }}>⏳ Cargando métricas...</div>
  }

  const metricCards = [
    { title: 'Ventas de Hoy', value: `S/ ${parseFloat(data?.hoy?.total || 0).toFixed(2)}`, subtitle: `${data?.hoy?.cantidad || 0} transacciones`, color: '#F5C100' },
    { title: 'Ventas del Mes', value: `S/ ${parseFloat(data?.mes?.total || 0).toFixed(2)}`, subtitle: `${data?.mes?.cantidad || 0} transacciones`, color: '#4ade80' },
    { title: 'Pedidos Pendientes', value: data?.pendientes || 0, subtitle: 'Por validar / despachar', color: '#f97316', link: '/admin/ventas?estado=pendiente' },
    { title: 'Productos Activos', value: data?.totalProductos || 0, subtitle: 'En catálogo', color: '#38bdf8', link: '/admin/inventario' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>Dashboard Ejecutivo</h1>
        <p style={{ fontSize: '13px', color: '#777', margin: 0 }}>Resumen comercial y operativo en tiempo real</p>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {metricCards.map((card, i) => (
          <div key={i} style={{
            background: '#141414', border: '1px solid #242424', borderRadius: '10px', padding: '20px',
            borderTop: `3px solid ${card.color}`
          }}>
            <div style={{ fontSize: '12px', color: '#888', fontWeight: '500', marginBottom: '8px' }}>{card.title}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{card.value}</div>
            <div style={{ fontSize: '11px', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{card.subtitle}</span>
              {card.link && <Link to={card.link} style={{ color: card.color, textDecoration: 'none', fontWeight: '600' }}>Ver →</Link>}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Top Productos & Ventas recientes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Top 5 Productos */}
        <div style={{ background: '#141414', border: '1px solid #242424', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔥 Top 5 Productos Más Vendidos (Mes)
          </h2>
          {(!data?.topProductos || data.topProductos.length === 0) ? (
            <p style={{ fontSize: '13px', color: '#666' }}>Aún no hay ventas registradas en este período.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.topProductos.map((p, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#1a1a1a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#F5C100', fontWeight: '700' }}>#{idx + 1}</span>
                    <span style={{ color: '#eee' }}>{p.nombre}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#fff' }}>{p.total_vendido} uds</div>
                    <div style={{ fontSize: '11px', color: '#777' }}>S/ {parseFloat(p.total_ingresos || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ventas Últimos 7 Días */}
        <div style={{ background: '#141414', border: '1px solid #242424', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Actividad Últimos 7 Días
          </h2>
          {(!data?.ventasPorDia || data.ventasPorDia.length === 0) ? (
            <p style={{ fontSize: '13px', color: '#666' }}>No hay transacciones en los últimos 7 días.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.ventasPorDia.map((d, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#1a1a1a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px'
                }}>
                  <span style={{ color: '#bbb' }}>{new Date(d.fecha).toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ color: '#777', fontSize: '12px' }}>{d.cantidad} ventas</span>
                    <span style={{ color: '#4ade80', fontWeight: '600' }}>S/ {parseFloat(d.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
