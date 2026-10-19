import { useState } from 'react'
import { Download, TrendingUp, Boxes, FileSpreadsheet, Loader2 } from 'lucide-react'
import api from '../../services/api'

export default function AdminReportes() {
  const [descargando, setDescargando] = useState(null)

  async function descargarExcel(endpoint, filenameDefault) {
    setDescargando(endpoint)
    try {
      const response = await api.get(endpoint, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filenameDefault)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error al descargar reporte: ' + (err.response?.data?.error || err.message))
    } finally {
      setDescargando(null)
    }
  }

  const reportes = [
    {
      titulo: 'Reporte Completo de Ventas',
      descripcion: 'Hoja de resumen de ventas, desglose de ítems comercializados, ingresos totales y estadísticas por canal y estado.',
      endpoint: '/reportes/ventas',
      filename: `Reporte_Ventas_${new Date().toISOString().slice(0, 10)}.xlsx`,
      icono: <TrendingUp size={24} color="#b45309" />,
      badge: 'Financiero & Ventas'
    },
    {
      titulo: 'Reporte de Inventario y Alertas',
      descripcion: 'Valorización total del stock en Soles (S/), cálculo de existencias, productos con stock bajo o agotado y últimos movimientos.',
      endpoint: '/reportes/inventario',
      filename: `Reporte_Inventario_${new Date().toISOString().slice(0, 10)}.xlsx`,
      icono: <Boxes size={24} color="#b45309" />,
      badge: 'Almacén & Logística'
    },
    {
      titulo: 'Catálogo General de Productos',
      descripcion: 'Listado completo de productos con precio de compra, precio de venta, cálculo de margen de ganancia porcentual y categorías.',
      endpoint: '/reportes/productos',
      filename: `Reporte_Productos_${new Date().toISOString().slice(0, 10)}.xlsx`,
      icono: <FileSpreadsheet size={24} color="#b45309" />,
      badge: 'Catálogo & Precios'
    },
  ]

  return (
    <div className="anim-page">
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Descarga de Reportes Oficiales</h1>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Hojas de cálculo Excel (.xlsx) con formato contable profesional y fórmulas de suma</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {reportes.map((rep, idx) => (
          <div
            key={idx}
            className={`product-card delay-${idx + 1}`}
            style={{
              padding: '26px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(245, 193, 0, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {rep.icono}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#0f172a',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '4px 12px',
                  borderRadius: '20px'
                }}>
                  {rep.badge}
                </span>
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>{rep.titulo}</h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.55, margin: 0 }}>{rep.descripcion}</p>
            </div>

            <button
              onClick={() => descargarExcel(rep.endpoint, rep.filename)}
              disabled={descargando === rep.endpoint}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13.5px'
              }}
            >
              {descargando === rep.endpoint ? (
                <><Loader2 size={16} className="animate-spin" /> Generando Excel...</>
              ) : (
                <><Download size={16} /> Descargar en Excel (.xlsx)</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
