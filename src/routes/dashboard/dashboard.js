const express = require('express');
const router = express.Router();
const axios = require('axios');

const FLASK_BASE_URL = 'http://10.0.14.117:5002'; // ✅ URL fija directa

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
      flaskHost: FLASK_BASE_URL,
      session: req.session // 👈 Asegúrate de pasar esto si lo usas en EJS
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
