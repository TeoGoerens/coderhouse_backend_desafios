const publicRoutes = (req, res, next) => {
  try {
    if (req.session.user.isLogged) {
      return res.redirect("/products");
    }
    next();
  } catch {
    next();
  }
};

export default publicRoutes;
