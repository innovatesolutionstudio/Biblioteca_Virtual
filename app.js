const express = require('express');
const app = express();
const path = require('path');

const session = require('express-session'); // ✅ Solo una vez
require('dotenv').config(); // Variables de entorno


// Configurar motor de vistas (por ejemplo, EJS)
app.set('views', path.join(__dirname, 'src/view'));
app.set('view engine', 'ejs'); // O pug, hbs, etc. según estés usando
// Acceso a documentos y portadas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Manejo de sesiones
app.use(session({
  secret: process.env.SECRET_KEY || 'mi_clave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 5 * 60 * 1000
  }
}));


// Hace que la sesión esté disponible en todas las vistas EJS como `session`
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
 
// Middleware para pasar la sesión a todas las vistas EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// Rutas para la pagina principal 
const paginaRoutes = require('./src/routes/pagina/pagina');
const loginRoutes = require('./src/routes/login/login');
const bibliotecaRoutes = require('./src/routes/pagina/biblioteca');
const libroRoutes = require('./src/routes/pagina/libro');
const dashboarRoutes = require('./src/routes/dashboard/dashboard');
const chatbotRoutes = require('./src/routes/pagina/chatbot');


app.use('/', paginaRoutes);
app.use(loginRoutes);
app.use(bibliotecaRoutes);
app.use(libroRoutes);
app.use(dashboarRoutes);
app.use(chatbotRoutes);

const rt12 = require('./src/routes/rt12/crud_libros');

app.use(rt12);

//rutas de improvisacion




// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
