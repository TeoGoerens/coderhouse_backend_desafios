import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import bcrypt from "bcrypt";

//Dotenv import and configuration
import dotenv from "dotenv";
dotenv.config();
const githubClientId = process.env.GITHUB_PASSPORT_CLIENTID;
const githubSecret = process.env.GITHUB_PASSPORT_SECRET;

//Local Strategy implementation
const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        const userExists = await userModel.findOne({ email: username });

        if (userExists) {
          return done(null, false);
        }

        const role = email === "admincoder@coder.com" ? "admin" : "user";

        const user = await userModel.create({
          first_name,
          last_name,
          email,
          age,
          role,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        });

        return done(null, user);
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            console.log("User not found");
            return done(null, false);
          }

          if (!bcrypt.compareSync(password, user.password)) {
            console.log("Incorrect password");
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Github Strategy implementation
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubSecret,
        callbackURL: "http://localhost:8080/api/githubcallback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });

          if (!user) {
            const newUser = userModel.create({
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              password: "",
              role: "user",
              email,
            });

            return done(null, newUser);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
