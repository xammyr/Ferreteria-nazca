import { createContext, useContext, useState, useEffect, useRef } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('ferreteria_carrito')
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [toast, setToast] = useState(null)
  const [cartBounce, setCartBounce] = useState(false)
  const [quickViewProducto, setQuickViewProducto] = useState(null)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem('ferreteria_carrito', JSON.stringify(items))
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [items])

  function agregar(producto, cantidad = 1, abrirDrawer = false) {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id)
      const maxStock = producto.stock_actual ?? 999
      if (existe) {
        const nuevaCant = Math.min(maxStock, existe.cantidad + cantidad)
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: nuevaCant } : i)
      }
      return [...prev, { ...producto, cantidad: Math.min(maxStock, cantidad) }]
    })

    // Trigger bounce en el ícono del carrito
    setCartBounce(false)
    setTimeout(() => setCartBounce(true), 10)
    setTimeout(() => setCartBounce(false), 500)

    if (abrirDrawer) {
      setDrawerAbierto(true)
    } else {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      setToast({
        id: Date.now(),
        producto,
        cantidad
      })
      toastTimerRef.current = setTimeout(() => {
        setToast(null)
      }, 3500)
    }
  }

  function quitar(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad <= 0) return quitar(id)
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i
      const maxStock = i.stock_actual ?? 999
      return { ...i, cantidad: Math.min(maxStock, cantidad) }
    }))
  }

  function vaciar() {
    setItems([])
  }

  function cerrarToast() {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(null)
  }

  const total = items.reduce((s, i) => s + parseFloat(i.precio_venta || 0) * i.cantidad, 0)
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0)

  return (
    <CarritoContext.Provider value={{
      items,
      agregar,
      quitar,
      cambiarCantidad,
      vaciar,
      total,
      totalItems,
      drawerAbierto,
      setDrawerAbierto,
      toast,
      cerrarToast,
      cartBounce,
      quickViewProducto,
      setQuickViewProducto
    }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  return useContext(CarritoContext)
}
