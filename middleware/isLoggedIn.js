
module.exports = ((req, res, next) => {
  if (!req.session.user) { 
    req.flash('errors', [{ msg: 'لطفاً ابتدا وارد شوید.' }]);
    return res.redirect('/api/auth/login');
  }
  next();
});