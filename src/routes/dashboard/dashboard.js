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
      axios.get(urlDatos, { timeout: 2000 }),
      axios.get(`${FLASK_BASE_URL}/api/anios`, { timeout: 2000 })
    ]);

    return res.render('Evolucion/dashboard', {
      datosInflacion: datosInflacionRes.data,
      aniosDisponibles: aniosRes.data,
      anioSeleccionado,
      flaskHost: FLASK_BASE_URL,
      session: req.session
    });

  } catch (error) {
    console.error('❌ Error conectando con Flask:', error.message);

    // Redirige a vista de mantenimiento
    return res.status(503).render('config/mantenimiento', {
      mensaje: 'El servicio de datos históricos no está disponible actualmente.'
    });
  }
});


module.exports = router;
