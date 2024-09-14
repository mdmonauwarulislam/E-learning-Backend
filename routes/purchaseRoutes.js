const express = require("express");
const Router = express.Router();

// Importing controllers and middlewares
const { verifyToken } = require("../middleware/authMiddleware");
const { purchaseCourse } = require("../controller/purchaseController");
const { checkEnrollment } = require("../controller/enrollmentController");

// Purchase course route
Router.post("/purchase-course", verifyToken, purchaseCourse);

// Check enrollment route
Router.get("/check-enrollment/:courseId", verifyToken, checkEnrollment);

module.exports = Router;
