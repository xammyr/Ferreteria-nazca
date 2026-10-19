import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { ClienteAuthProvider, useClienteAuth } from './context/ClienteAuthContext'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import QuickViewModal from './components/QuickViewModal'
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
import { Loader2 } from 'lucide-react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function FullScreenLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      gap: '12px',
      color: '#475569'
    }}>
      <Loader2 size={34} className="animate-spin" color="#F5C100" />
      <span style={{ fontSize: '13px', fontWeight: '500' }}>Cargando...</span>
    </div>
  )
}

// Ruta protegida para clientes
function RutaProtegida({ children }) {
  const { cliente, cargando } = useClienteAuth()
  const location = useLocation()

  if (cargando) return <FullScreenLoader />
  if (!cliente) return <Navigate to="/login" state={{ from: location.pathname }} />
  return children
}

// Ruta protegida para personal administrativo
function RutaProtegidaAdmin({ children }) {
  const { admin, cargando } = useAdminAuth()

  if (cargando) return <FullScreenLoader />
  if (!admin) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <AdminAuthProvider>
      <ClienteAuthProvider>
        <CarritoProvider>
          <BrowserRouter>
            <ScrollToTop />
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
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Navbar />
                  <CartDrawer />
                  <QuickViewModal />
                  <main style={{ flex: 1 }}>
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
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </CarritoProvider>
      </ClienteAuthProvider>
    </AdminAuthProvider>
  )
}
