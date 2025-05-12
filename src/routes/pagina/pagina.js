// src/routes/pagina/index.js
const express = require('express');
const router = express.Router();

// Ruta principal - Página de inicio
router.get('/', (req, res) => {
  res.render('Pagina/index'); // Usa una vista llamada 'inicio.ejs' o el motor que estés usando
});



// Ruta para ChatBot
router.get('/Asistente', (req, res) => {
  res.render('Chatbot/chatbot');
});

// Ruta para Galeria de imagenes generadas
router.get('/Galeria', (req, res) => {
  res.render('galeria/galeria');
});

// Ruta para Nuestra Bolivia
router.get('/Nuestra-Bolivia', (req, res) => {
  res.render('Boliva/mapas');
});

// Ruta para Evolucion Historica - inicio
router.get('/Evolucion-Historica', (req, res) => {
  res.render('Evolucion/evolucion_historica');
});

// Ruta para Evolucion Historica - dashboard
router.get('/Evolucion-Historica-Dashboard', (req, res) => {
  res.render('Evolucion/dashboard');
});



module.exports = router;