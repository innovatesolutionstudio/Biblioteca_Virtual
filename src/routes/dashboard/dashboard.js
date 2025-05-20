const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ruta para Evolucion Historica - inicio
router.get('/Evolucion-Historica', (req, res) => {
  res.render('Evolucion/evolucion_historica');
});
router.get('/Evolucion-Historica-Dashboard', async (req, res) => {
  const FLASK_BASE_URL = res.locals.serviceUrls.flaskHost;

  try {
    const anioSeleccionado = req.query.anio;
    const urlDatos = anioSeleccionado
      ? `${FLASK_BASE_URL}/api/inflacion?anio=${anioSeleccionado}`
      : `${FLASK_BASE_URL}/api/inflacion`;

    const [datosInflacionRes, aniosRes] = await Promise.all([
      axios.get(urlDatos),
      axios.get(`${FLASK_BASE_URL}/api/anios`)
    ]);

    res.render('Evolucion/dashboard', {
      datosInflacion: datosInflacionRes.data,
      aniosDisponibles: aniosRes.data,
      anioSeleccionado,
      flaskHost: FLASK_BASE_URL,
      session: req.session
    });
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
    res.render('Evolucion/dashboard', {
      datosInflacion: [],
      aniosDisponibles: [],
      anioSeleccionado: null,
      flaskHost: FLASK_BASE_URL,
      session: req.session
    });
  }
});


module.exports = router;
