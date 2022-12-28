const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyEmail,
} = require("../middleware/auth");

module.exports = (app) => {
  const users = require("../controllers/usersController");

  const router = require("express").Router();

  // Public
  router.post("/register", verifyEmail, hashPassword, users.create);
  router.post("/login", users.getUserByEmailAndPassword, verifyPassword);

  //Private => Authentification with token
  // Retrieve all Users
  router.get("/users", verifyToken, users.findAll);

  // Retrieve one User with username
  router.get("/users/:username", verifyToken, users.findOne);

  app.use("/api", router);
};
