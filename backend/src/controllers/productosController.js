const { productos, categorias, nextProductoId } = require('../data/store')

function conCategoria(producto) {
  const categoria = categorias.find(c => c.id === producto.categoria_id) || null
  return { ...producto, categorias: categoria }
}

// GET /api/productos
function listar(req, res) {
  const { categoria_id, buscar, solo_activos, page = 1, limit = 20 } = req.query

  let resultado = [...productos]
  if (solo_activos === 'true') resultado = resultado.filter(p => p.activo)
  if (categoria_id) resultado = resultado.filter(p => p.categoria_id === parseInt(categoria_id))
  if (buscar) resultado = resultado.filter(p => p.nombre.toLowerCase().includes(buscar.toLowerCase()))

  const total = resultado.length
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const pagina = resultado.slice(skip, skip + parseInt(limit)).map(conCategoria)

  res.json({ productos: pagina, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
}

// GET /api/productos/:id
function obtener(req, res) {
  const producto = productos.find(p => p.id === parseInt(req.params.id))
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(conCategoria(producto))
}

// POST /api/productos
function crear(req, res) {
  const { codigo, nombre, descripcion, categoria_id,
          precio_compra, precio_venta, unidad, stock_actual, stock_minimo } = req.body

  if (!codigo || !nombre || !precio_venta)
    return res.status(400).json({ error: 'codigo, nombre y precio_venta son requeridos' })

  if (productos.some(p => p.codigo === codigo))
    return res.status(400).json({ error: 'El código ya existe' })

  const producto = {
    id: nextProductoId(),
    codigo, nombre, descripcion: descripcion || null,
    categoria_id: categoria_id ? parseInt(categoria_id) : null,
    precio_compra: parseFloat(precio_compra || 0),
    precio_venta: parseFloat(precio_venta),
    unidad: unidad || 'unidad',
    stock_actual: parseInt(stock_actual || 0),
    stock_minimo: parseInt(stock_minimo || 5),
    activo: true
  }
  productos.push(producto)

  res.status(201).json(producto)
}

// PUT /api/productos/:id
function actualizar(req, res) {
  const producto = productos.find(p => p.id === parseInt(req.params.id))
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })

  const { codigo, nombre, descripcion, categoria_id,
          precio_compra, precio_venta, unidad, stock_actual, stock_minimo, activo } = req.body

  if (codigo !== undefined) producto.codigo = codigo
  if (nombre !== undefined) producto.nombre = nombre
  if (descripcion !== undefined) producto.descripcion = descripcion
  if (categoria_id !== undefined) producto.categoria_id = categoria_id ? parseInt(categoria_id) : null
  if (precio_compra !== undefined) producto.precio_compra = parseFloat(precio_compra)
  if (precio_venta !== undefined) producto.precio_venta = parseFloat(precio_venta)
  if (unidad !== undefined) producto.unidad = unidad
  if (stock_actual !== undefined) producto.stock_actual = parseInt(stock_actual)
  if (stock_minimo !== undefined) producto.stock_minimo = parseInt(stock_minimo)
  if (activo !== undefined) producto.activo = activo

  res.json(producto)
}

// DELETE /api/productos/:id (soft delete)
function eliminar(req, res) {
  const producto = productos.find(p => p.id === parseInt(req.params.id))
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })

  producto.activo = false
  res.json({ mensaje: 'Producto desactivado' })
}

module.exports = { listar, obtener, crear, actualizar, eliminar }
