import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { ClienteAuthProvider, useClienteAuth } from './context/ClienteAuthContext'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Producto from './pages/Producto'
import { Carrito, Checkout } from './pages/Carrito'
import LoginCliente from './pages/LoginCliente'
import MisPedidos from './pages/MisPedidos'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVentas from './pages/admin/AdminVentas'
import AdminInventario from './pages/admin/AdminInventario'
import AdminReportes from './pages/admin/AdminReportes'

// Ruta protegida para clientes
function RutaProtegida({ children }) {
  const { cliente, cargando } = useClienteAuth()
  const location = useLocation()

  if (cargando) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '32px' }}>⏳</div>
  if (!cliente) return <Navigate to="/login" state={{ from: location.pathname }} />
  return children
}

// Ruta protegida para personal administrativo
function RutaProtegidaAdmin({ children }) {
  const { admin, cargando } = useAdminAuth()

  if (cargando) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '32px' }}>⏳</div>
  if (!admin) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <AdminAuthProvider>
      <ClienteAuthProvider>
        <CarritoProvider>
          <BrowserRouter>
            <Routes>
              {/* Portal Administrativo (Backoffice) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <RutaProtegidaAdmin><AdminLayout /></RutaProtegidaAdmin>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="ventas" element={<AdminVentas />} />
                <Route path="inventario" element={<AdminInventario />} />
                <Route path="reportes" element={<AdminReportes />} />
              </Route>

              {/* Tienda Web Pública y Clientes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/producto/:id" element={<Producto />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/login" element={<LoginCliente />} />
                    <Route path="/checkout" element={
                      <RutaProtegida><Checkout /></RutaProtegida>
                    } />
                    <Route path="/mis-pedidos" element={
                      <RutaProtegida><MisPedidos /></RutaProtegida>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </>
              } />
            </Routes>
          </BrowserRouter>
        </CarritoProvider>
      </ClienteAuthProvider>
    </AdminAuthProvider>
  )
}
