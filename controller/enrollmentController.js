const Enrollment = require("../models/EnrollmentModel");

// Check if the user is enrolled in the course
const checkEnrollment = async (req, res) => {
  const userId = req.user._id; // Get user ID from token (middleware)
  const courseId = req.params.courseId; // Get course ID from route params

  try {
    // Check for existing enrollment
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

    if (enrollment) {
      return res.status(200).json({ enrolled: true });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error checking enrollment status.", error });
  }
};

module.exports = {
  checkEnrollment,
};
