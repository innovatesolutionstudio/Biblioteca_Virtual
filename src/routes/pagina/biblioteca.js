const express = require('express');
const router = express.Router();

const db = require('../../database/firebase');
router.get('/Biblioteca', async (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase();
    const categoria = (req.query.categoria || '').toLowerCase();

    const librosSnapshot = await db.collection('libros').get();
    const libros = [];
    const generosSet = new Set();

    librosSnapshot.forEach(doc => {
      const data = doc.data();
      const librosInternos = data.libros || {};

      for (const key in librosInternos) {
        const libro = librosInternos[key];

        const genero = libro.genero || '';
        const libroFinal = {
          id: doc.id,
          titulo: libro.titulo || 'Sin título',
          autor: libro.autor || 'Desconocido',
          ano_publicacion: libro.ano_publicacion || 'N/A',
          portada: data.portada || '/img/libros2.png',
          documento: data.documento || '#',
          genero: genero,
          descripcion: libro.descripcion || ''
        };

        // Agregar género a set (sin duplicados, y en minúsculas uniformes)
        if (genero.trim() !== '') {
          generosSet.add(genero.trim());
        }

        // FILTRO POR BÚSQUEDA
        const texto = (libroFinal.titulo + libroFinal.autor + libroFinal.descripcion).toLowerCase();
        if (query && !texto.includes(query)) continue;

        // FILTRO POR CATEGORÍA
        if (categoria && genero.toLowerCase() !== categoria) continue;

        libros.push(libroFinal);
      }
    });

    // Convertir Set a Array ordenado
    const generos = Array.from(generosSet).sort();

    res.render('biblioteca/biblioteca', {
      libros,
      query: req.query.q,
      categoria,
      generos
    });
  } catch (error) {
    console.error('Error al cargar libros:', error);
    res.status(500).send('Error al cargar libros');
  }
});

module.exports = router;
