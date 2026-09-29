import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'
import { TrendingUp, Flame, Loader2, ArrowRight } from 'lucide-react'

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
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6b7280', fontSize: '18px', gap: '8px' }}>
      <Loader2 className="animate-spin" size={24} /> Cargando métricas...
    </div>
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
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: '0 0 6px 0' }}>Dashboard Ejecutivo</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Resumen comercial y operativo en tiempo real</p>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {metricCards.map((card, i) => (
          <div key={i} style={{
            background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px',
            borderTop: `4px solid ${card.color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.title}</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1f2937', marginBottom: '4px' }}>{card.value}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{card.subtitle}</span>
              {card.link && <Link to={card.link} style={{ color: card.color, textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>Ver <ArrowRight size={12}/></Link>}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Top Productos & Ventas recientes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Top 5 Productos */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#ef4444" /> Top 5 Productos Más Vendidos (Mes)
          </h2>
          {(!data?.topProductos || data.topProductos.length === 0) ? (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Aún no hay ventas registradas en este período.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.topProductos.map((p, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#f9fafb', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#F5C100', fontWeight: '800' }}>#{idx + 1}</span>
                    <span style={{ color: '#374151', fontWeight: '500' }}>{p.nombre}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: '#1f2937' }}>{p.total_vendido} uds</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>S/ {parseFloat(p.total_ingresos || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ventas Últimos 7 Días */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#3b82f6" /> Actividad Últimos 7 Días
          </h2>
          {(!data?.ventasPorDia || data.ventasPorDia.length === 0) ? (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>No hay transacciones en los últimos 7 días.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.ventasPorDia.map((d, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#f9fafb', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #f3f4f6'
                }}>
                  <span style={{ color: '#4b5563', fontWeight: '500' }}>{new Date(d.fecha).toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>{d.cantidad} ventas</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>S/ {parseFloat(d.total || 0).toFixed(2)}</span>
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
