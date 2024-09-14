

const Enrollment = require("../models/EnrollmentModel"); 
const Course = require("../models/coursesModel");
const User = require("../models/usersModel");
const httpsStatusCode = require("../constant/httpStatuscode")

// Purchase course and enroll the user
const purchaseCourse = async (req, res) => {
  const userId = req.user._id; // Extracting user info from token (middleware)
  const { courseId } = req.body; 
  console.log("courseid :", courseId);
  console.log("userid :", userId);
 

  try {
    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });

    if (existingEnrollment) {
      return res.status(httpsStatusCode.CONFLICT).json({ 
        success: false,
        message: "You are already enrolled in this course." });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(httpsStatusCode.NOT_FOUND).json({
        success: false, 
        message: "Course not found." 
      });
    }

    const user = await User.findById(userId);
    if(!user) {
      return res.status(httpsStatusCode).json({ 
        success: false,
        message: "User not found." 
      });
    }

    // Create a new enrollment record
    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      enrolledOn: new Date(),
    });
    if (!newEnrollment) {
      return res.status(httpsStatusCode.INTERNAL_SERVER_ERROR).json({ 
        sucess: false,
        message: "Enrollment error" 
      });
    }

    course.purchasedBy.push(userId);
    await course.save();
    user.purchasedCourses.push(courseId);
    await user.save();


    return res.status(httpsStatusCode.OK).json({ 
      sucess : true,
      message: "Successfully enrolled in the course."
     });
  } catch (error) {
    return res.status(httpsStatusCode).json({ 
      success: false,
      message: "Error enrolling in the course.", error : error.message 
    });
  }
};

module.exports = {
  purchaseCourse,
};
