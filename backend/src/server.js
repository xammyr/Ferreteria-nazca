require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')
const pool = require('./config/db')

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
    mensaje: '🔧 API Ferretería Nasca funcionando (con conexión a MySQL)',
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
    const conexion = await pool.getConnection()
    await conexion.ping()
    conexion.release()
    console.log('✅ Conexión a MySQL establecida correctamente')
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos MySQL:', err.message)
    console.error('   Revisa DB_HOST, DB_USER, DB_PASSWORD y DB_NAME en tu archivo .env')
    console.error('   y que hayas importado bd/ferreteria_nazca.sql')
  }

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  })
}

iniciar()
