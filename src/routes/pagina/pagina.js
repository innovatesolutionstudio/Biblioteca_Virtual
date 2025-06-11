const express = require('express');
const router = express.Router();
const axios = require('axios');
const FLASK_HOST = process.env.FLASK_HOST;
const FLASK_PORT = process.env.FLASK_PORT || 5000;


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



// copia desde aqui
const FLASK_BASE_URL = process.env.FLASK_HOST;

// Ruta para página inicial de Evolución Histórica
router.get('/Evolucion-Historica', (req, res) => {
  res.render('Evolucion/evolucion_historica');
});

// Ruta para el dashboard de Evolución Histórica
router.get('/Evolucion-Historica-Dashboard', async (req, res) => {
  try {
    const anioSeleccionado = req.query.anio;
    const departamentoSeleccionado = req.query.departamento || 'LA PAZ';
    const indicadorPoblacion = req.query.indicadorPoblacion || 'POBLACIÓN EMPADRONADA 2012';
    const indicadorPobreza = req.query.indicadorPobreza || 'Porcentaje de Población Pobre';

    const urlInflacion = anioSeleccionado
      ? `${FLASK_BASE_URL}/api/inflacion?anio=${anioSeleccionado}`
      : `${FLASK_BASE_URL}/api/inflacion`;
    const urlPoblacion = `${FLASK_BASE_URL}/api/poblacion?departamento=${encodeURIComponent(departamentoSeleccionado)}&indicador=${encodeURIComponent(indicadorPoblacion)}`;
    const urlPobreza = `${FLASK_BASE_URL}/api/pobreza?departamento=${encodeURIComponent(departamentoSeleccionado)}&indicador=${encodeURIComponent(indicadorPobreza)}`;

    // Inicializar datos por defecto
    let datosInflacion = [];
    let aniosDisponibles = [];
    let indicadoresPoblacion = [];
    let indicadoresPobreza = [];
    let datosPoblacion = { labels: [], valores: [], tipo: 'simple' };
    let datosPobreza = { labels: [], valores: [], tipo: 'simple' };

    // Hacer peticiones individuales con manejo de errores
    try {
      const datosInflacionRes = await axios.get(urlInflacion, { timeout: 2000 });
      datosInflacion = datosInflacionRes.data;
    } catch (err) {
      console.error('Error en inflacion:', err.message);
    }

    try {
      const aniosRes = await axios.get(`${FLASK_BASE_URL}/api/anios`, { timeout: 2000 });
      aniosDisponibles = aniosRes.data;
    } catch (err) {
      console.error('Error en anios:', err.message);
    }

    try {
      const indicadoresPobRes = await axios.get(`${FLASK_BASE_URL}/api/indicadores_poblacion`, { timeout: 2000 });
      indicadoresPoblacion = indicadoresPobRes.data;
    } catch (err) {
      console.error('Error en indicadores_poblacion:', err.message);
    }

    try {
      const indicadoresPobrezaRes = await axios.get(`${FLASK_BASE_URL}/api/indicadores_pobreza`, { timeout: 2000 });
      indicadoresPobreza = indicadoresPobrezaRes.data;
    } catch (err) {
      console.error('Error en indicadores_pobreza:', err.message);
    }

    try {
      const datosPoblacionRes = await axios.get(urlPoblacion, { timeout: 2000 });
      datosPoblacion = datosPoblacionRes.data;
    } catch (err) {
      console.error('Error en poblacion:', err.message);
    }

    try {
      const datosPobrezaRes = await axios.get(urlPobreza, { timeout: 2000 });
      datosPobreza = datosPobrezaRes.data;
    } catch (err) {
      console.error('Error en pobreza:', err.message);
    }

    res.render('Evolucion/dashboard', {
      datosInflacion,
      aniosDisponibles,
      indicadoresPoblacion,
      indicadoresPobreza,
      datosPoblacion,
      datosPobreza,
      anioSeleccionado,
      departamentoSeleccionado,
      indicadorPoblacion,
      indicadorPobreza,
      flaskHost: FLASK_BASE_URL,
      session: req.session
    });
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    res.status(500).json({ error: 'Error inesperado en el servidor. Por favor, intenta de nuevo.' });
  }
});

const { ensureAuthenticated } = require('../../middlewares/auth');
router.get('/Subir-Dataset', ensureAuthenticated, (req, res) => {
  const flaskHost = process.env.FLASK_HOST;
  res.render('Evolucion/subir_dataset', { flaskHost });
});



module.exports = router;