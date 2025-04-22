const express = require('express');
const app = express();
const path = require('path');

// Configurar motor de vistas (por ejemplo, EJS)
app.set('views', path.join(__dirname, 'src/view'));
app.set('view engine', 'ejs'); // O pug, hbs, etc. según estés usando

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Rutas
const paginaRoutes = require('./src/routes/pagina/pagina');

app.use('/', paginaRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
