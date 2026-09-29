import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const data = localStorage.getItem('admin_data')

    if (token && data) {
      try {
        setAdmin(JSON.parse(data))
      } catch {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_data')
      }
    }
    setCargando(false)
  }, [])

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_data', JSON.stringify(data.usuario))
    setAdmin(data.usuario)
    return data
  }

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_data')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, cargando, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
