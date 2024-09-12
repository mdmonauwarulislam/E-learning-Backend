const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { purchaseCourse } = require("../controller/purchaseController");

// Purchase course route
Router.post("/purchase-course", verifyToken, purchaseCourse);

module.exports = Router;
