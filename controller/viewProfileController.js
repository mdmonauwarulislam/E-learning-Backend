const userModel = require("../models/usersModel");
const httpStatusCode = require("../constant/httpStatuscode");

const viewProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(httpStatusCode.OK).json({
            success: true,
            message: "Profile viewed",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = { viewProfile };
