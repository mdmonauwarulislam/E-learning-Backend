const userModel = require("../models/user");
const httpStatuscode = require("../constant/httpStatuscode");

const viewProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(httpStatuscode.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(httpStatuscode.OK).json({
      success: true,
      message: "Profile viewed",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        courses: user.courses,
        purchasedCourses: user.purchasedCourses,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(httpStatuscode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { viewProfile };
