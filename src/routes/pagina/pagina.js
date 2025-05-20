// src/routes/pagina/index.js
const express = require('express');
const router = express.Router();


const db = require('../../database/firebase'); // Asegúrate que esta ruta sea correcta



// Ruta principal - Página de inicio
router.get('/', (req, res) => {
  res.render('Pagina/index',{
     session: req.session
  }); // Usa una vista llamada 'inicio.ejs' o el motor que estés usando
  
});


router.get('/imagen/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await db.collection('imagenes').doc(docId).get();

    if (!doc.exists) {
      return res.status(404).send('Imagen no encontrada');
    }

    const data = doc.data();


const imagen = {
  descripcion: data.descripcion || 'Sin descripción',
  fecha: data.fecha?.toDate().toLocaleString() || '', // ✅ conversión correcta
  imagen_base64: data.imagen_base64 || '',
  url: data.url || '',
  verificacion: data.verificacion || 0,
  codigo: data.codigo_peticion || ''
};


    res.render('Pagina/imagen', {
      imagen,
      session: req.session
    });

  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    res.status(500).send('Error al cargar la imagen');
  }
});


// Ruta para ChatBot
router.get('/Asistente', (req, res) => {
  res.render('Chatbot/chatbot',{
    session: req.session
  });
});

// Ruta para Galeria de imagenes generadas
router.get('/Galeria', (req, res) => {
  res.render('galeria/galeria',{
     session: req.session
  });
});

// Ruta para Nuestra Bolivia
router.get('/Nuestra-Bolivia', (req, res) => {
  res.render('Boliva/mapas',{ 
    session: req.session
  });
});


module.exports = router;