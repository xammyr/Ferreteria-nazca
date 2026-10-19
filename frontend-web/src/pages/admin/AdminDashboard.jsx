import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'
import { TrendingUp, Flame, ArrowRight, DollarSign, Calendar, Clock, Package } from 'lucide-react'

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
    return (
      <div>
        <div className="skeleton" style={{ height: '28px', width: '240px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton" style={{ height: '120px', borderRadius: '14px' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div className="skeleton" style={{ height: '260px', borderRadius: '14px' }} />
          <div className="skeleton" style={{ height: '260px', borderRadius: '14px' }} />
        </div>
      </div>
    )
  }

  const metricCards = [
    {
      title: 'Ventas de Hoy',
      value: `S/ ${parseFloat(data?.hoy?.total || 0).toFixed(2)}`,
      subtitle: `${data?.hoy?.cantidad || 0} transacciones hoy`,
      color: '#eab308',
      bg: 'rgba(245, 193, 0, 0.15)',
      icon: <DollarSign size={20} color="#b45309" />
    },
    {
      title: 'Ventas del Mes',
      value: `S/ ${parseFloat(data?.mes?.total || 0).toFixed(2)}`,
      subtitle: `${data?.mes?.cantidad || 0} transacciones en el mes`,
      color: '#16a34a',
      bg: '#dcfce7',
      icon: <Calendar size={20} color="#15803d" />
    },
    {
      title: 'Pedidos Pendientes',
      value: data?.pendientes || 0,
      subtitle: 'Por validar pago / despachar',
      color: '#ea580c',
      bg: '#ffedd5',
      icon: <Clock size={20} color="#ea580c" />,
      link: '/admin/ventas?estado=pendiente'
    },
    {
      title: 'Productos Activos',
      value: data?.totalProductos || 0,
      subtitle: 'Disponibles en catálogo',
      color: '#0284c7',
      bg: '#e0f2fe',
      icon: <Package size={20} color="#0284c7" />,
      link: '/admin/inventario'
    },
  ]

  const maxVendido = Math.max(1, ...(data?.topProductos?.map(p => Number(p.total_vendido || 0)) || [1]))

  return (
    <div className="anim-page">
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Dashboard Ejecutivo</h1>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Resumen comercial y operativo de Ferretería Nasca en tiempo real</p>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {metricCards.map((card, i) => (
          <div
            key={i}
            className={`anim-card delay-${i + 1}`}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '20px',
              borderTop: `4px solid ${card.color}`,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {card.title}
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{card.subtitle}</span>
              {card.link && (
                <Link to={card.link} style={{ color: card.color, textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  Gestionar <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Top Productos & Ventas recientes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Top 5 Productos */}
        <div className="anim-section delay-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={19} color="#ef4444" /> Top 5 Productos Más Vendidos (Mes)
          </h2>
          {(!data?.topProductos || data.topProductos.length === 0) ? (
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>Aún no hay ventas registradas en este período.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.topProductos.map((p, idx) => {
                const pct = Math.min(100, Math.round((Number(p.total_vendido || 0) / maxVendido) * 100))
                return (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: idx === 0 ? '#F5C100' : '#e2e8f0',
                          color: '#0f172a',
                          fontWeight: '800',
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          #{idx + 1}
                        </span>
                        <span style={{ color: '#0f172a', fontWeight: '700' }}>{p.nombre}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '800', color: '#0f172a' }}>{p.total_vendido} uds</span>
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>
                          (S/ {parseFloat(p.total_ingresos || 0).toFixed(2)})
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#F5C100', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ventas Últimos 7 Días */}
        <div className="anim-section delay-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={19} color="#0284c7" /> Actividad Últimos 7 Días
          </h2>
          {(!data?.ventasPorDia || data.ventasPorDia.length === 0) ? (
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>No hay transacciones en los últimos 7 días.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.ventasPorDia.map((d, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  border: '1px solid #f1f5f9'
                }}>
                  <span style={{ color: '#0f172a', fontWeight: '600', textTransform: 'capitalize' }}>
                    {new Date(d.fecha).toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '600' }}>
                      {d.cantidad} {d.cantidad === 1 ? 'venta' : 'ventas'}
                    </span>
                    <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '15px' }}>
                      S/ {parseFloat(d.total || 0).toFixed(2)}
                    </span>
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
