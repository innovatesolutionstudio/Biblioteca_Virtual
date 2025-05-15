const express = require('express');
const router = express.Router();
const axios = require('axios');
const FLASK_HOST = process.env.FLASK_HOST;
const FLASK_PORT = process.env.FLASK_PORT || 5000;

// Construir la URL base del servidor Flask
const FLASK_BASE_URL = `http://${FLASK_HOST}:${FLASK_PORT}`;



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
      ? `${FLASK_BASE_URL}/api/inflacion?anio=${anioSeleccionado}`
      : `${FLASK_BASE_URL}/api/inflacion`;

    const [datosInflacionRes, aniosRes] = await Promise.all([
      axios.get(urlDatos),
      axios.get(`${FLASK_BASE_URL}/api/anios`)
    ]);

    const datosInflacion = datosInflacionRes.data;
    const aniosDisponibles = aniosRes.data;

    res.render('Evolucion/dashboard', {
      datosInflacion,
      aniosDisponibles,
      anioSeleccionado,
      flaskHost: FLASK_BASE_URL 
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