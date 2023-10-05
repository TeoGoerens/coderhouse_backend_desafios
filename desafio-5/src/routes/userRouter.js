import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
const router = Router();

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.send("User is already registered");
  }

  const role =
    email === "admincoder@coder.com" && password === "coder123"
      ? "admin"
      : "user";

  const user = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    role,
    password,
  });

  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.email = email;
  req.session.age = age;
  req.session.role = role;
  req.session.isLogged = true;

  return res.redirect("/products");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, password });

  if (!user) {
    return res.send("Your credentials are incorrect");
  }

  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.role = user.role;
  req.session.isLogged = true;

  return res.redirect("/products");
});

export default router;
