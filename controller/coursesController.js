const Courses = require("../models/coursesModel");
const userModel = require("../models/usersModel");
const httpStatusCode = require("../constant/httpStatuscode");
const { validationResult } = require("express-validator");

const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }
    const userId = req.user._id;
    const { title, description, subCourse, weekDuration, courseLevel } = req.body;
    const course = await Courses.create({
      title,
      description,
      subCourse,
      weekDuration,
      courseLevel,
      createdBy: userId,
    });
    if (!course) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Course not created",
      })
    }
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Course created",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not create course",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const courseId = req.params.id;
    const userId = req.user.id;
    const { title, description, subCourse, weekDuration, courseLevel } = req.body;

    const course = await Courses.findById(courseId);

    if (!course) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.createdBy.toString() !== userId) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "You are not authorized to update this course",
      });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.weekDuration = weekDuration || course.weekDuration;
    course.courseLevel = courseLevel || course.courseLevel;
    course.subCourse = subCourse || course.subCourse;


    await course.save();

    return res.status(httpStatusCode.ACCEPTED).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not update course",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Courses.findById(courseId);

    if (!course) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.createdBy.toString() !== userId) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    await course.remove();

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not delete course",
      error: error.message,
    });
  }
};

const viewCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Courses.findById(courseId);

    if (!course) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Courses retrieved successfully",
      course,
    });
  } catch (error) {
    console.error("Error viewing course:", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not retrieve course",
      error: error.message,
    });
  }
};

const viewCourseList = async (req, res) => {
  try {
    const courseList = await Courses.find().populate({ path: 'createdBy', });
    if (!courseList.length) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "No courses found!",
      });
    }
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Courses list retrieved successfully!",
      data: courseList,
    });
  } catch (error) {
    console.error("Error viewing course list:", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not retrieve course list",
      error: error.message,
    });
  }
};

const viewSingleCourse = async (req, res) => {
  try {
    const singleCourse = await Courses.find();
    if (!singleCourse) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Course not founded!",
      });
    }
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Course founded!",
      data: singleCourse,
    })
  } catch (error) {
    console.error("Error viewing course List:", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not retrieve course List",
      error: error.message,
    });
  }
}
module.exports = { createCourse, updateCourse, deleteCourse, viewCourse, viewCourseList, viewSingleCourse };
