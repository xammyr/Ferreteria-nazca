const express = require('express')
const router = express.Router()
const { authMiddleware, soloAdmin } = require('../middlewares/auth')

const authCtrl = require('../controllers/authController')
const productosCtrl = require('../controllers/productosController')
const categoriasCtrl = require('../controllers/categoriasController')

// ── AUTH ──────────────────────────────────────────────────────
router.post('/auth/login', authCtrl.login)
router.post('/auth/register', authMiddleware, soloAdmin, authCtrl.register)
router.get('/auth/me', authMiddleware, authCtrl.me)

// ── PRODUCTOS (CRUD básico) ─────────────────────────────────
router.get('/productos', productosCtrl.listar)
router.get('/productos/:id', productosCtrl.obtener)
router.post('/productos', authMiddleware, productosCtrl.crear)
router.put('/productos/:id', authMiddleware, productosCtrl.actualizar)
router.delete('/productos/:id', authMiddleware, soloAdmin, productosCtrl.eliminar)

// ── CATEGORÍAS (soporte a productos) ─────────────────────────
router.get('/categorias', categoriasCtrl.listar)
router.post('/categorias', authMiddleware, soloAdmin, categoriasCtrl.crear)

module.exports = router
