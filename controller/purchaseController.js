const Course = require("../models/coursesModel");
const User = require("../models/usersModel");
const httpStatusCode = require("../constant/httpStatuscode")

const purchaseCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(httpStatusCode.BAD_REQUEST).json({ 
        message: 'Course not found' 
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(httpStatusCode.BAD_REQUEST).json({ 
        message: 'User not found' 
      });
    }

    // Check if course is already purchased
    if (user.purchasedCourses.includes(courseId)) {
      return res.status(httpStatusCode.BAD_REQUEST).json({ 
        message: 'Course ready purchased' 
      });
    }
    if(course.purchasedBy.includes(userId)){
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message : "course already purchased"
      });
    }

    // Add course to purchased courses
    user.purchasedCourses.push(courseId);
    await user.save();
    course.purchasedBy.push(userId);
    await course.save();
    res.status(httpStatusCode.OK).json({
       message: 'Course purchased successfully' 
      });
  } catch (error) {
    console.error('Error purchasing course:', error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ 
      message: 'Server error' 
    });
  }
};

module.exports = { purchaseCourse };
