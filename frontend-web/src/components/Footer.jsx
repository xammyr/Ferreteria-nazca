import { Wrench, MapPin, Phone, Clock, ShieldCheck, CreditCard, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#cbd5e1',
      borderTop: '3px solid #F5C100',
      fontFamily: "'IBM Plex Sans', sans-serif",
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '48px 24px 36px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '36px'
      }}>
        {/* Columna 1: Marca */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              background: '#F5C100',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a'
            }}>
              <Wrench size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '800', fontSize: '17px', lineHeight: 1 }}>
                Ferretería Nasca
              </div>
              <div style={{ color: '#F5C100', fontSize: '10px', letterSpacing: '2px', marginTop: '3px', fontWeight: '700' }}>
                CONSTRUCCIÓN & HOGAR
              </div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
            Tu aliado estratégico en materiales de construcción, herramientas eléctricas, plomería y acabados en toda la provincia de Nasca.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 193, 0, 0.12)', border: '1px solid rgba(245, 193, 0, 0.3)', color: '#F5C100', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
            <ShieldCheck size={14} /> Garantía y stock real en tienda
          </div>
        </div>

        {/* Columna 2: Enlaces rápidos */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
            Navegación Rápida
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/productos" style={{ color: '#94a3b8', textDecoration: 'none' }}>Catálogo Completo</Link>
            <Link to="/carrito" style={{ color: '#94a3b8', textDecoration: 'none' }}>Mi Carrito de Compras</Link>
            <Link to="/mis-pedidos" style={{ color: '#94a3b8', textDecoration: 'none' }}>Seguimiento de Pedidos</Link>
            <Link to="/admin" style={{ color: '#F5C100', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600', marginTop: '4px' }}>
              Portal Administrativo <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Columna 3: Ubicación y Horarios */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
            Tienda y Atención
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
              <MapPin size={16} color="#F5C100" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Jr. Lima 123, Cercado de Nasca, Ica — Perú</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
              <Clock size={16} color="#F5C100" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ color: '#e2e8f0', fontWeight: '600' }}>Lunes a Sábado: 7:30 am – 7:30 pm</div>
                <div style={{ fontSize: '12px' }}>Domingos y Feriados: 8:00 am – 2:00 pm</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <Phone size={16} color="#F5C100" style={{ flexShrink: 0 }} />
              <span>Ventas y WhatsApp: <strong style={{ color: '#ffffff' }}>+51 999 888 777</strong></span>
            </div>
          </div>
        </div>

        {/* Columna 4: Pagos */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
            Compra Fácil y Segura
          </h4>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F5C100', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
              <CreditCard size={18} /> Pago directo con Yape
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '12px' }}>
              Reserva tus materiales desde la web, adjunta tu captura de pago y recoge sin colas en tienda.
            </p>
            <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
              Número oficial Yape: <span style={{ color: '#F5C100' }}>999 888 777</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '18px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        © {new Date().getFullYear()} Ferretería Nasca — Todos los derechos reservados. Diseñado para construcción y hogar.
      </div>
    </footer>
  )
}
