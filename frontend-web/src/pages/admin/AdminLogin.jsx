import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { Wrench, ArrowLeft, ShieldAlert, Lock } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const { admin, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  if (admin) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas o error en el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="anim-page" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'IBM Plex Sans', sans-serif"
    }}>
      <div className="anim-modal-content" style={{
        background: '#ffffff',
        border: '2px solid #F5C100',
        borderRadius: '18px',
        padding: '38px 34px',
        width: '100%',
        maxWidth: '410px',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            background: '#F5C100',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            marginBottom: '14px',
            boxShadow: '0 6px 16px rgba(245, 193, 0, 0.35)'
          }}>
            <Wrench size={25} strokeWidth={2.4} />
          </div>
          <h1 style={{ fontSize: '21px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Portal Administrativo</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Acceso exclusivo para personal de Ferretería Nasca</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px', marginBottom: '6px' }}>
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@ferreteria.com"
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
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px', marginBottom: '6px' }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
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
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="btn-primary"
            style={{
              marginTop: '6px',
              padding: '13px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Lock size={16} />
            {cargando ? 'Verificando acceso...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Volver a la tienda pública
          </Link>
        </div>
      </div>
    </div>
  )
}
