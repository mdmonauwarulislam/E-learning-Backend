const express = require("express");
const Router = express.Router();

const{userRegistration, userLogin} = require("../controller/user")

Router.post("/signup", userRegistration);
Router.post("/login", userLogin)

module.exports = Router;