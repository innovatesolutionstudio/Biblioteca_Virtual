const { ensureAuthenticated } = require('../../middlewares/auth');
router.get('/Subir-Dataset', ensureAuthenticated, (req, res) => {
  const flaskHost = process.env.FLASK_HOST;
  res.render('Evolucion/subir_dataset', { flaskHost });
});