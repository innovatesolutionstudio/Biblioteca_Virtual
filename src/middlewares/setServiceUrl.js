module.exports = (req, res, next) => {
  res.locals.serviceUrls = req.session.serviceUrls || {
    flaskHost: 'http://localhost:5002',
    phpHost: 'http://localhost:5003'
  };
  next();
};
