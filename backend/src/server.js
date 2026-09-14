require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares globales
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas API
app.use('/api', routes)

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    mensaje: '🔧 API Ferretería Nasca funcionando (datos en memoria, sin base de datos)',
    version: '1.0.0',
    endpoints: '/api'
  })
})

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  console.log('📦 Datos en memoria (sin base de datos) — se reinician al reiniciar el servidor')
})
