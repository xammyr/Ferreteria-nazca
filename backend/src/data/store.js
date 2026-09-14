const bcrypt = require('bcryptjs')

const usuarios = [
  {
    id: 1,
    nombre: 'Admin',
    email: 'admin@nasca.com',
    password: bcrypt.hashSync('admin123', 10),
    rol: 'admin',
    activo: true
  }
]

const categorias = [
  { id: 1, nombre: 'Herramientas', descripcion: 'Herramientas manuales y eléctricas', activa: true },
  { id: 2, nombre: 'Pinturas', descripcion: 'Pinturas y accesorios', activa: true }
]

const productos = [
  {
    id: 1,
    codigo: 'HER-001',
    nombre: 'Martillo 16oz',
    descripcion: 'Martillo de uña, mango de fibra de vidrio',
    categoria_id: 1,
    precio_compra: 15.0,
    precio_venta: 25.0,
    unidad: 'unidad',
    stock_actual: 20,
    stock_minimo: 5,
    activo: true
  }
]

let nextUsuarioId = usuarios.length + 1
let nextCategoriaId = categorias.length + 1
let nextProductoId = productos.length + 1

module.exports = {
  usuarios,
  categorias,
  productos,
  nextUsuarioId: () => nextUsuarioId++,
  nextCategoriaId: () => nextCategoriaId++,
  nextProductoId: () => nextProductoId++
}
