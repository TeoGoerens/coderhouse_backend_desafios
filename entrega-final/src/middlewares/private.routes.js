const privateRoutes = (req, res, next) => {
  try {
    if (!req.session.user.isLogged) {
      return res.redirect("/login");
    }
    next();
  } catch {
    return res.redirect("/login");
  }
};

export default privateRoutes;
