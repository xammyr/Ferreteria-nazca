import { Package, Search, Plus, Filter, Download, X, Eye, Check, Truck, AlertCircle, Clock, CheckCircle2, ChevronRight, Edit, Trash2 } from 'lucide-react'
﻿import { useState } from 'react'
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
      icono: '💰',
      badge: 'Financiero & Ventas'
    },
    {
      titulo: 'Reporte de Inventario y Alertas',
      descripcion: 'Valorización total del stock en Soles (S/), cálculo de existencias, productos con stock bajo o agotado y últimos movimientos.',
      endpoint: '/reportes/inventario',
      filename: `Reporte_Inventario_${new Date().toISOString().slice(0, 10)}.xlsx`,
      icono: '',
      badge: 'Almacén & Logística'
    },
    {
      titulo: 'Catálogo General de Productos',
      descripcion: 'Listado completo de productos con precio de compra, precio de venta, cálculo de margen de ganancia porcentual y categorías.',
      endpoint: '/reportes/productos',
      filename: `Reporte_Productos_${new Date().toISOString().slice(0, 10)}.xlsx`,
      icono: '📋',
      badge: 'Catálogo & Precios'
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: '0 0 6px 0' }}>Descarga de Reportes Oficiales</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Hojas de cálculo Excel (.xlsx) con formato contable profesional y fórmulas de suma</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {reportes.map((rep, idx) => (
          <div key={idx} style={{
            background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '28px' }}>{rep.icono}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#F5C100', background: 'rgba(245,193,0,0.1)', padding: '3px 10px', borderRadius: '12px' }}>
                  {rep.badge}
                </span>
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>{rep.titulo}</h2>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>{rep.descripcion}</p>
            </div>

            <button
              onClick={() => descargarExcel(rep.endpoint, rep.filename)}
              disabled={descargando === rep.endpoint}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '11px', background: '#F5C100', color: '#1f2937', border: 'none', borderRadius: '8px',
                fontWeight: '700', fontSize: '13px', cursor: descargando === rep.endpoint ? 'wait' : 'pointer',
                opacity: descargando === rep.endpoint ? 0.7 : 1
              }}
            >
              {descargando === rep.endpoint ? '⏳ Generando Excel...' : '📥 Descargar en Excel (.xlsx)'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
