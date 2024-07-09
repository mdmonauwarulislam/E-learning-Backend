const express = require("express");
const Router = express.Router();

const { userRegistration, userLogin } = require("../controller/usersController");
const { viewProfile } = require("../controller/viewProfileController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const {createCourse, updateCourse, deleteCourse, viewCourse, viewCourseList, viewSingleCourse} = require("../controller/coursesController");
const {adminRegister, adminLogin} = require("../controller/adminController")

// user routes
Router.post("/user/signup", userRegistration);
Router.post("/user/login", userLogin);

// admin routes
Router.post("/admin/signup", adminRegister);
Router.post("/admin/login", adminLogin);

// view profile routes
Router.get("/profile", verifyToken, viewProfile);

// course routes
Router.post("/course", verifyToken, verifyAdmin, createCourse);
Router.put("/course/:id", verifyToken, verifyAdmin, updateCourse);
Router.delete("/course/:id", verifyToken, verifyAdmin, deleteCourse);
Router.get("/course/:id", verifyToken, viewCourse);
Router.get("/view-course-list", viewCourseList);
Router.get("/view-single-course", viewSingleCourse);


module.exports = Router;
