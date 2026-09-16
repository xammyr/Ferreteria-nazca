const prisma = require('../lib/prisma')

// GET /api/categorias
async function listar(req, res) {
  try {
    const categorias = await prisma.categorias.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' }
    })
    res.json(categorias)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// POST /api/categorias
async function crear(req, res) {
  const { nombre, descripcion, icono } = req.body
  if (!nombre) return res.status(400).json({ error: 'nombre es requerido' })

  try {
    const existentes = await prisma.categorias.findFirst({ where: { nombre } })
    if (existentes)
      return res.status(400).json({ error: 'La categoría ya existe' })

    const categoria = await prisma.categorias.create({
      data: { nombre, descripcion: descripcion || null, icono: icono || null, activa: true }
    })

    res.status(201).json(categoria)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

module.exports = { listar, crear }
