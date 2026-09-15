const pool = require('../config/db')

// GET /api/categorias
async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, descripcion, activa FROM categorias WHERE activa = true ORDER BY nombre'
    )
    const categorias = rows.map(c => ({ ...c, activa: !!c.activa }))
    res.json(categorias)
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// POST /api/categorias
async function crear(req, res) {
  const { nombre, descripcion } = req.body
  if (!nombre) return res.status(400).json({ error: 'nombre es requerido' })

  try {
    const [existentes] = await pool.query(
      'SELECT id FROM categorias WHERE nombre = ?',
      [nombre]
    )
    if (existentes.length > 0)
      return res.status(400).json({ error: 'La categoría ya existe' })

    const [resultado] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion, activa) VALUES (?, ?, true)',
      [nombre, descripcion || null]
    )

    res.status(201).json({
      id: resultado.insertId,
      nombre,
      descripcion: descripcion || null,
      activa: true
    })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

module.exports = { listar, crear }
