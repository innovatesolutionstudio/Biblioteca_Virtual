// src/routes/pagina/index.js
const express = require('express');
const router = express.Router();

// Ruta de login
router.get('/login', (req, res) => {
    res.render('login/login');
});



// Ruta de login
router.get('/login', (req, res) => {
    res.render('login/login');
});

// Ruta de registrar nuevo user
router.get('/registro', (req, res) => {
    res.render('login/registro');
});

// Ruta de recuperar cuenta
router.get('/recuperar-contrasena', (req, res) => {
    res.render('login/recuperar_contrasena');
});


module.exports = router;