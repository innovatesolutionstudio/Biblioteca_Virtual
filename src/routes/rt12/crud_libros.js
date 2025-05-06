const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const pdfPoppler = require('pdf-poppler');

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../../uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Renderiza vista
router.get('/crud-libros', (req, res) => {
  res.render('rt12/crud_libros');
});

// Endpoint principal
router.post('/cargar-libro', upload.single('libro'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, mensaje: 'No se recibió archivo' });
    }

    const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    const contenido = data.text;

    const portadaPath = await generarImagenPrimeraPagina(filePath, req.file.filename);

    const metadatos = {
      titulo: extraerCampo(contenido, /Título\s*:\s*(.*)/i, "No identificado"),
      autor: extraerCampo(contenido, /Autor\s*:\s*(.*)/i, "Desconocido"),
      ano_publicacion: extraerAnio(contenido),
      genero: extraerCampo(contenido, /Género\s*:\s*(.*)/i, "Desconocido"),
      idioma: "Español",
      precio: 15.99,
      portada: `/uploads/portadas/${portadaPath}`,
      editorial: extraerCampo(contenido, /Editorial\s*:\s*(.*)/i, "Editorial no encontrada"),
      edicion: extraerCampo(contenido, /Edición\s*:\s*(.*)/i, "1era edición"),
      documento: `/uploads/${req.file.filename}`,
      descripcion: extraerDescripcion(contenido),
      sinopsis: contenido.slice(0, 1000) + '...'
    };

    res.json({ success: true, datos: metadatos });

  } catch (error) {
    console.error('Error al procesar el libro:', error);
    res.status(500).json({ success: false, mensaje: 'Error al procesar el libro' });
  }
});

// 🔍 Campo simple
function extraerCampo(texto, regex, porDefecto) {
  const match = texto.match(regex);
  return match ? match[1].trim() : porDefecto;
}

// 📅 Año
function extraerAnio(texto) {
  const match = texto.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : 0;
}

// 📘 Descripción por sección
function extraerDescripcion(texto) {
  const secciones = ['presentación', 'introducción', 'resumen'];
  for (const seccion of secciones) {
    const index = texto.toLowerCase().indexOf(seccion);
    if (index !== -1) {
      return texto.slice(index, index + 1000) + '...';
    }
  }
  return "No se encontró una introducción clara.";
}

// 🖼️ Portada desde primera página con pdf-poppler
async function generarImagenPrimeraPagina(pdfPath, filename) {
    const outputDir = path.join(__dirname, '../../../uploads/portadas');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
    const nombreSalida = filename.replace('.pdf', '');
    const options = {
      format: 'png',
      out_dir: outputDir,
      out_prefix: nombreSalida,
      page: 1,
      resolution: 150
    };
  
    await pdfPoppler.convert(pdfPath, options);
    return `${nombreSalida}-1.png`; // Página 1 termina con "-1"
  }
  
module.exports = router;
