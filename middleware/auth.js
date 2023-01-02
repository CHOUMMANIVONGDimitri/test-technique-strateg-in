const argon2 = require("argon2");
const config = require("../config/authConfig");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      req.body.password = hashedPassword;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = (req, res) => {
  argon2
    .verify(req.user.users.password, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.user.users._id };
        const token = jwt.sign(payload, config.secret, {
          expiresIn: "1h",
        });
        res.send({ token });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyEmail = (req, res, next) => {
  User.findOne({ email: `${req.body.email}` })
    .then((users) => {
      if (users === null) {
        req.user = { users };
        next();
      } else {
        res.status(401).send("Le mail est déjà utilisé.");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error the mail " + req.body.email + " is already use.",
      });
    });
};

const verifyToken = (req, res, next) => {
  try {
    const autorizationHeader = req.get("Authorization");

    if (autorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = autorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, config.secret);

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyEmail,
};
