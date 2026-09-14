const { categorias, nextCategoriaId } = require('../data/store')

// GET /api/categorias
function listar(req, res) {
  res.json(categorias.filter(c => c.activa))
}

// POST /api/categorias
function crear(req, res) {
  const { nombre, descripcion } = req.body
  if (!nombre) return res.status(400).json({ error: 'nombre es requerido' })

  if (categorias.some(c => c.nombre === nombre))
    return res.status(400).json({ error: 'La categoría ya existe' })

  const categoria = { id: nextCategoriaId(), nombre, descripcion: descripcion || null, activa: true }
  categorias.push(categoria)

  res.status(201).json(categoria)
}

module.exports = { listar, crear }
