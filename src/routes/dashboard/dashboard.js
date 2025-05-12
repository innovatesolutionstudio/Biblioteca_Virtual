const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/dashboard', async (req, res) => {
    try {
        const anioSeleccionado = req.query.anio;
        const urlDatos = anioSeleccionado
            ? `http://localhost:5000/api/inflacion?anio=${anioSeleccionado}`
            : `http://localhost:5000/api/inflacion`;

        const [datosInflacionRes, aniosRes] = await Promise.all([
            axios.get(urlDatos),
            axios.get('http://localhost:5000/api/anios')
        ]);

        const datosInflacion = datosInflacionRes.data;
        const aniosDisponibles = aniosRes.data;

        res.render('dashboard', { datosInflacion, aniosDisponibles, anioSeleccionado });
    } catch (error) {
        console.error('Error al conectar con Flask:', error.message);
        res.render('dashboard', { datosInflacion: [], aniosDisponibles: [], anioSeleccionado: null });
    }
});

module.exports = router;
