require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')
const prisma = require('./lib/prisma')

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
    mensaje: '🔧 API Ferretería Nasca funcionando (PostgreSQL / Prisma)',
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

async function iniciar() {
  try {
    await prisma.$connect()
    console.log('✅ Conexión a PostgreSQL establecida correctamente con Prisma')
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos PostgreSQL:', err.message)
    console.error('   Revisa la variable DATABASE_URL en tu archivo .env')
  }

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  })
}

iniciar()
