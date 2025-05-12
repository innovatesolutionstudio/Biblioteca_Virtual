// src/routes/pagina/index.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ruta principal - Página de inicio
router.get('/', (req, res) => {
  res.render('Pagina/index'); // Usa una vista llamada 'inicio.ejs' o el motor que estés usando
});

// Ruta catálogo de libros
router.get('/Biblioteca', (req, res) => {
  res.render('biblioteca/biblioteca');
});

// Ruta para ver libro especifico
router.get('/Libro', (req, res) => {
  res.render('biblioteca/libro');
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
router.get('/Evolucion-Historica-Dashboard', async (req, res) => {
  try {
    const anioSeleccionado = req.query.anio;
    const urlDatos = anioSeleccionado
      ? `http://localhost:5000/api/inflacion?anio=${anioSeleccionado}`
      : `http://localhost:5000/api/inflacion`;

    // Obtener datos del backend Python
    const [datosInflacionRes, aniosRes] = await Promise.all([
      axios.get(urlDatos),
      axios.get('http://localhost:5000/api/anios')
    ]);

    const datosInflacion = datosInflacionRes.data;
    const aniosDisponibles = aniosRes.data;

    res.render('Evolucion/dashboard', {
      datosInflacion,
      aniosDisponibles,
      anioSeleccionado
    });
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
    res.render('Evolucion/dashboard', {
      datosInflacion: [],
      aniosDisponibles: [],
      anioSeleccionado: null
    });
  }
});


module.exports = router;