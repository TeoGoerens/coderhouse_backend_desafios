import Controllers from "./class.controller.js";
import UserRepository from "../persistence/daos/repository/user.repository.js";
import transport from "../config/nodemailer.config.js";
import bcrypt from "bcrypt";
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";

const userRepository = new UserRepository();

export default class UserController extends Controllers {
  constructor() {
    super(userRepository);
  }

  signUpRedirect = (req, res, next) => {
    return res.redirect("/login");
  };

  loginRedirect = async (req, res, next) => {
    if (!req.user) {
      res.status(400).send();
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      isLogged: true,
    };

    return res.redirect("/products");
  };

  resetPassword = async (req, res, next) => {
    const emailToReset = req.body.email;
    const resetLink = `http://localhost:8080/newpassword`;

    let result = await transport.sendMail({
      from: "chacho@elrincondechacho.com",
      to: emailToReset,
      subject: "Recupero de contraseña",
      html: `<h1>¿Has olvidado tu contraseña?</h1>
          <h3>Para poder resetear tu contraseña haz clic en el link debajo</h3>
          <a href="${resetLink}">${resetLink}</a>`,
    });
    return res.redirect("/login");
  };

  confirmPassword = async (req, res, next) => {
    const email = req.body.email;
    const newPassword = req.body.password;
    const user = await userModel.findOne({ email: email });
    let errorMessage;

    if (!user) {
      errorMessage = "User was not found";
      return res.render("login", { errorMessage });
    }

    if (bcrypt.compareSync(newPassword, user.password)) {
      errorMessage = "Your new password matches the previous one";
      return res.render("login", { errorMessage });
    } else {
      user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
      await user.save();
      errorMessage = "Password was effectively reset";
      return res.render("login", { errorMessage });
    }
  };

  togglePremium = async (req, res, next) => {
    const userId = req.params.uid;
    const user = await userModel.findOne({ _id: userId });
    let message;

    switch (user.role) {
      case "admin":
        message = "User's role is ADMIN. It can't be changed";
        break;
      case "user":
        //Verify required documents
        const requiredDocumentNames = [
          "Identificación",
          "Comprobante de domicilio",
          "Comprobante de estado de cuenta",
        ];
        const hasRequiredDocuments = requiredDocumentNames.every(
          (requiredName) => {
            return user.documents.some(
              (document) => document.name == requiredName
            );
          }
        );

        if (hasRequiredDocuments) {
          message = "New user's role is PREMIUM";
          user.role = "premium";
          await user.save();
          //req.session.user.role = "premium";
        } else {
          message =
            "User must have the required documents to upgrade to PREMIUM";
        }
        break;

      case "premium":
        message = "New user's role is USER";
        user.role = "user";
        await user.save();
        //req.session.user.role = "user";
        break;
    }

    res.json(message);
  };

  githubCallbackRedirect = (req, res, next) => {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      isLogged: true,
    };
    return res.redirect("/products");
  };

  uploadDocuments = async (req, res, next) => {
    const userId = req.params.uid;

    const documents = req.files
      ? req.files.map((file) => {
          let name;
          const fileExtension = file.originalname
            .split(".")
            .pop()
            .toLowerCase();

          switch (fileExtension) {
            case "png":
              name = "Identificación";
              break;
            case "jpeg":
              name = "Comprobante de domicilio";
              break;
            default:
              name = "Comprobante de estado de cuenta";
          }

          return {
            name,
            reference: `uploads/documents/${file.filename}`,
          };
        })
      : [];

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $push: { documents: { $each: documents } } },
      { new: true }
    );

    res.status(200).send({ message: "Files uploaded", files: documents });
  };

  getAllUsers = async (req, res, next) => {
    try {
      const users = await userModel.find({}, "first_name last_name email role");

      res
        .status(200)
        .send({ message: "These are the current active users", users });
    } catch (error) {
      res.status(404).send({ message: "Something went wrong", error });
    }
  };

  deleteInactiveUsers = async (req, res, next) => {
    try {
      //Establish the condition of "inactivity"
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);
      const condition = { last_connection: { $lt: twoDaysAgo } };

      //Retrieve all users under the above-defined condition
      const usersToDelete = await userModel.find(condition);

      //verify the amount of users to delete
      if (usersToDelete.length > 0) {
        //Inform via email deleted users about their removal from our DB
        await Promise.all(
          usersToDelete.map(async (user) => {
            const mailOptions = {
              from: "chacho@elrincondechacho.com",
              to: user.email,
              subject: "Eliminación de cuenta por inactividad",
              html: `<h1>Hola ${user.first_name} ${user.last_name}</h1>
 <h3>Nos apena mucho ver que hace tiempo no nos visitas :(</h3>
 <p>Lamentablemente debimos eliminar tu cuenta por inactividad. Espero que vuelvas pronto a visitarnos.</p>`,
            };
            let mailSent = await transport.sendMail(mailOptions);
          })
        );

        //Delete inactive users
        const result = await userModel.deleteMany(condition);

        res.status(200).send({
          message: `${result.deletedCount} users have been successfully eliminated`,
          usersToDelete,
        });
      } else {
        res.status(200).send({
          message: `No inactive users to delete`,
        });
      }
    } catch (error) {
      res.status(404).send({ message: "Something went wrong", error });
    }
  };

  deleteUser = async (req, res, next) => {
    const userIdToDelete = req.params.uid;
    try {
      const deletedUser = await userModel.findByIdAndDelete(userIdToDelete);
      if (deletedUser) {
        res.status(200).json({
          message: `User with id ${userIdToDelete} was deleted`,
          userIdToDelete,
        });
      } else {
        res.status(200).json({
          message: `User with id ${userIdToDelete} was not deleted`,
          userIdToDelete,
        });
      }
    } catch (error) {
      res.status(404).json({
        message: `Error while deleting user with id ${userIdToDelete}`,
        error,
      });
    }
  };
}
