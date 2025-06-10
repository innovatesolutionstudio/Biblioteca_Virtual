const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/Biblioteca', async (req, res) => {
  try {

    const query = req.query.q || '';
    const categoria = req.query.categoria || '';

const response = await axios.get('http://libros-service:5001/api/libros', {

      params: { q: query, categoria: categoria }
    });

    const libros = response.data.libros;
    const generos = [...new Set(libros.map(l => l.genero.trim().toLowerCase()))].sort();

    res.render('biblioteca/biblioteca', {
      libros,
      query,
      categoria,
      generos
    });
  } catch (error) {
    console.error('Error solicitando libros al microservicio:', error.message);
    res.status(500).send('Error al consultar libros');
  }
});


// Ruta del servidor central que usa microservicio
router.get('/Libro/:id', async (req, res) => {
  try {
const response = await axios.get(`http://libros-service:5001/api/libros/${req.params.id}`);
    const libro = response.data.libro;

    res.render('biblioteca/libro', { libro });
  } catch (error) {
    console.error('Error al obtener libro desde el microservicio:', error.message);
    res.status(500).send('Error al cargar libro');
  }
});

module.exports = router;
