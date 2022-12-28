const dbConfig = require("../config/db");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./usersModel.js")(mongoose);

module.exports = db;
