const userAuthorization = (req, res, next) => {
  try {
    if (req.session.user.role == "user") {
      next();
    } else {
      return res.redirect("/admin");
    }
  } catch {
    return res.redirect("/admin");
  }
};

export default userAuthorization;
