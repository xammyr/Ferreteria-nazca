const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { usuarios, nextUsuarioId } = require('../data/store')

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email y password requeridos' })

  try {
    const usuario = usuarios.find(u => u.email === email)

    if (!usuario || !usuario.activo)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// POST /api/auth/register (solo admin puede crear usuarios)
async function register(req, res) {
  const { nombre, email, password, rol } = req.body

  if (!nombre || !email || !password || !rol)
    return res.status(400).json({ error: 'Todos los campos son requeridos' })

  if (!['admin', 'vendedor', 'almacenero'].includes(rol))
    return res.status(400).json({ error: 'Rol inválido' })

  try {
    const existe = usuarios.find(u => u.email === email)
    if (existe) return res.status(400).json({ error: 'Email ya registrado' })

    const hash = await bcrypt.hash(password, 10)
    const usuario = {
      id: nextUsuarioId(),
      nombre, email, password: hash, rol, activo: true
    }
    usuarios.push(usuario)

    res.status(201).json({
      id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol
    })
  } catch (err) {
    res.status(500).json({ error: 'Error interno', detalle: err.message })
  }
}

// GET /api/auth/me
async function me(req, res) {
  res.json(req.usuario)
}

module.exports = { login, register, me }
