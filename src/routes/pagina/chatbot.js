const express = require('express'); 
const router = express.Router();

router.post('/api/chatbot', async (req, res) => {
  try {
    if (!req.body || !req.body.pregunta) {
      return res.status(400).json({ respuesta: '❌ Pregunta no proporcionada.' });
    }

    const { pregunta } = req.body;
    console.log("📩 Enviando pregunta a microservicio PHP:", pregunta);

    const fetch = (await import('node-fetch')).default;
    const respuestaPhp = await fetch(`${res.locals.serviceUrls.phpHost}/src/Chatbot.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta })
    });


    const data = await respuestaPhp.json();
    console.log("✅ Respuesta recibida del microservicio:", data);
    res.json(data);

  } catch (error) {
    console.error('❌ ERROR DETECTADO:', error);
    res.status(500).json({ respuesta: 'Error interno al contactar con el asistente.' });
  }
});


module.exports = router;
