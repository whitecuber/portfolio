function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login?next=' + encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`))
  }
}

module.exports = isAuthenticated