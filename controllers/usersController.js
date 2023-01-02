const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({ message: "Username content can not be empty!" });
    return;
  }
  if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({ message: "Password can not be empty!" });
    return;
  }

  // Create a User
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  // Save User in the database
  user
    .save(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.find({})
    .then((data) => {
      const usersData = data.map((user) => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      }));
      res.send(usersData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find Users with an username
exports.findOne = (req, res) => {
  const username = req.params.username;
  const condition = username ? { username: req.params.username } : {};

  User.find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Not found user with username " + req.body.username,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with username=" + req.body.username,
      });
    });
};

// Get user by email and password
exports.getUserByEmailAndPassword = (req, res, next) => {
  User.findOne({ email: `${req.body.email}` })
    .then((users) => {
      if (users != null) {
        req.user = { users };
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with email= " + req.body.email,
      });
    });
};
