const express = require('express');
const router = express.Router();
const db = require('../../database/firebase');

// Ruta para ver libro específico
router.get('/Libro/:id', async (req, res) => {
  try {
    const doc = await db.collection('libros').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).send('Libro no encontrado');
    }

    const data = doc.data();
    const libro001 = Object.values(data.libros || {})[0]; // Primer libro del objeto

    const libro = {
      titulo: libro001.titulo || 'Sin título',
      autor: libro001.autor || 'Desconocido',
      ano_publicacion: libro001.ano_publicacion || 'N/A',
      edicion: libro001.edicion || '',
      editorial: libro001.editorial || '',
      genero: libro001.genero || '',
      idioma: libro001.idioma || '',
      sinopsis: libro001.sinopsis || '',
      portada: data.portada || '/img/libros2.png',
      documento: data.documento || '#'
    };

    res.render('biblioteca/libro', { libro });

  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).send('Error al cargar libro');
  }
});

module.exports = router;
