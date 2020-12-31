exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Images Lib | Error 404',
    path: '',
    isAuthenticated: req.session.isLoggedIn
  });
};