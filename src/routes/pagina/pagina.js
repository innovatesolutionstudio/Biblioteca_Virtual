// src/routes/pagina/index.js
const express = require('express');
const router = express.Router();

// Ruta principal - Página de inicio
router.get('/', (req, res) => {
  res.render('Pagina/index'); // Usa una vista llamada 'inicio.ejs' o el motor que estés usando
});

// Ruta catálogo de libros
router.get('/catalogo', (req, res) => {
  res.render('catalogo');
});

// Ruta contacto
router.get('/contacto', (req, res) => {
  res.render('contacto');
});

module.exports = router;