const express = require("express");
const Router = express.Router();

const { userRegistration, userLogin } = require("../controller/user");
const { viewProfile } = require("../controller/profile");
const { verifyToken } = require("../middleware/auth");

Router.post("/signup", userRegistration);
Router.post("/login", userLogin);
Router.get("/profile", verifyToken, viewProfile);

module.exports = Router;
