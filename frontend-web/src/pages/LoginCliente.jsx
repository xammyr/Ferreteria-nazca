import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Wrench, ArrowLeft, AlertCircle } from 'lucide-react'
import { useClienteAuth } from '../context/ClienteAuthContext'

export default function LoginCliente() {
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', confirmar: '', direccion: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login, register } = useClienteAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirigir = location.state?.from || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (modo === 'register' && form.password !== form.confirmar)
      return setError('Las contraseñas no coinciden')
    setCargando(true)
    try {
      if (modo === 'login') await login(form.email, form.password)
      else await register(form.nombre, form.email, form.telefono, form.password, form.direccion)
      navigate(redirigir)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la solicitud')
    } finally {
      setCargando(false)
    }
  }

  const inp = (label, key, type = 'text', placeholder = '', required = true) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        required={required}
        className="input-modern"
        style={{
          width: '100%',
          padding: '11px 14px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          color: '#0f172a',
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>
  )

  return (
    <div className="anim-page" style={{
      minHeight: '82vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'IBM Plex Sans', sans-serif",
      padding: '32px 20px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '38px 34px',
        width: '100%',
        maxWidth: '430px',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            background: '#F5C100',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            margin: '0 auto 12px',
            boxShadow: '0 6px 16px rgba(245, 193, 0, 0.35)'
          }}>
            <Wrench size={26} strokeWidth={2.3} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Ferretería Nasca</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            {modo === 'login' ? 'Accede a tu cuenta de cliente' : 'Regístrate para realizar pedidos rápidos'}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          {[['login', 'Iniciar sesión'], ['register', 'Registrarse']].map(([val, lbl]) => (
            <button
              key={val}
              type="button"
              onClick={() => { setModo(val); setError('') }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: modo === val ? '#F5C100' : 'transparent',
                color: modo === val ? '#0f172a' : '#64748b',
                fontWeight: modo === val ? '700' : '600',
                fontSize: '13px',
                transition: 'all 0.18s ease'
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {modo === 'register' && inp('NOMBRE COMPLETO', 'nombre', 'text', 'Juan Pérez')}
          {inp('CORREO ELECTRÓNICO', 'email', 'email', 'correo@ejemplo.com')}
          {modo === 'register' && inp('TELÉFONO / WHATSAPP', 'telefono', 'tel', '999888777')}
          {modo === 'register' && inp('DIRECCIÓN EN NASCA (OPCIONAL)', 'direccion', 'text', 'Jr. Lima 123, Nasca', false)}
          {inp('CONTRASEÑA', 'password', 'password', '••••••••')}
          {modo === 'register' && inp('CONFIRMAR CONTRASEÑA', 'confirmar', 'password', '••••••••')}

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              color: '#dc2626',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              fontSize: '14.5px',
              fontWeight: '700',
              marginTop: '6px'
            }}
          >
            {cargando ? 'Procesando...' : modo === 'login' ? 'Ingresar a mi cuenta' : 'Crear mi cuenta'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
