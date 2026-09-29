import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
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
    <div style={{
      background: '#0a0a0a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'IBM Plex Sans', sans-serif"
    }}>
      <div style={{
        background: '#141414',
        border: '1px solid #282828',
        borderRadius: '14px',
        padding: '36px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px', height: '48px', background: '#F5C100', borderRadius: '10px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px'
          }}>🔧</div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>Panel Administrativo</h1>
          <p style={{ fontSize: '13px', color: '#777', margin: 0 }}>Acceso para personal de Ferretería Nazca</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#bbb', marginBottom: '6px' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@nasca.com"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '11px 14px', background: '#1c1c1c',
                border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#bbb', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '11px 14px', background: '#1c1c1c',
                border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              marginTop: '8px', padding: '12px', background: '#F5C100', color: '#0a0a0a',
              border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px',
              cursor: cargando ? 'wait' : 'pointer', opacity: cargando ? 0.7 : 1
            }}
          >
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
