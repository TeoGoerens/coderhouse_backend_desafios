const adminAuthorization = (req, res, next) => {
  try {
    if (req.session.user.role == "admin") {
      next();
    } else {
      return res.redirect("/products");
    }
  } catch {
    return res.redirect("/products");
  }
};

export default adminAuthorization;
