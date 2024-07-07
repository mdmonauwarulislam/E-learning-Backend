const express = require("express");
const Router = express.Router();

const { userRegistration, userLogin } = require("../controller/user");
const { viewProfile } = require("../controller/profile");
const { verifyToken } = require("../middleware/auth");
const {createCourse, updateCourse, deleteCourse, viewCourse, viewCourseList} = require("../controller/courses");

Router.post("/signup", userRegistration);
Router.post("/login", userLogin);
Router.get("/profile", verifyToken, viewProfile);
Router.post("/course", verifyToken, createCourse);
Router.put("/course/:id", verifyToken, updateCourse);
Router.delete("/course/:id", verifyToken, deleteCourse);
Router.get("/course/:id", verifyToken, viewCourse);
Router.get("/view-course-list", viewCourseList);


module.exports = Router;
