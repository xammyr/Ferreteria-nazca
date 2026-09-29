import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

// Interceptor de petición: inyecta el token correspondiente de forma automática
api.interceptors.request.use((config) => {
  // Si la petición ya trae Authorization definida, respetarla
  if (config.headers.Authorization) {
    return config
  }

  const isAdminRoute = window.location.pathname.startsWith('/admin')
  const adminToken = localStorage.getItem('admin_token')
  const clienteToken = localStorage.getItem('cliente_token')

  if (isAdminRoute && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`
  } else if (adminToken && (config.url?.startsWith('/ventas') || config.url?.startsWith('/inventario') || config.url?.startsWith('/reportes') || config.url?.startsWith('/proveedores') || config.url?.startsWith('/config'))) {
    // Si es una ruta administrativa del backend y hay admin_token disponible
    config.headers.Authorization = `Bearer ${adminToken}`
  } else if (clienteToken) {
    config.headers.Authorization = `Bearer ${clienteToken}`
  }

  return config
}, (error) => Promise.reject(error))

// Interceptor de respuesta: captura 401 y limpia tokens caducados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_data')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api