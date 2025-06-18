// middleware/auth.js
function isLoggedIn(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.redirect('/login');
}

module.exports = { isLoggedIn };
