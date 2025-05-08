const express = require('express');
const app = express();
const path = require('path');

// Configurar motor de vistas (por ejemplo, EJS)
app.set('views', path.join(__dirname, 'src/view'));
app.set('view engine', 'ejs'); // O pug, hbs, etc. según estés usando
// Acceso a documentos y portadas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Rutas para la pagina principal 
const paginaRoutes = require('./src/routes/pagina/pagina');
const loginRoutes = require('./src/routes/login/login');

app.use('/', paginaRoutes);
app.use(loginRoutes);

const rt12 = require('./src/routes/rt12/crud_libros');

app.use(rt12);

//rutas de improvisacion




// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
