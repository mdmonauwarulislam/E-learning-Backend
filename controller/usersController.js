const bcrypt = require("bcrypt");
const httpStatusCode = require("../constant/httpStatuscode");
const userModel = require("../models/usersModel");
const { validationResult } = require("express-validator");
const { getToken } = require("../middleware/authMiddleware");

const userRegistration = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { fullName, email, password } = req.body;

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(httpStatusCode.CONFLICT).json({
                success: false,
                message: "User is already registered with this email. Please login!"
            });
        }

        // Hashing password and creating new user
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);

        let newUser = await userModel.create({
            fullName,
            email,
            password: hash,
            role:"User",
        });

        return res.status(httpStatusCode.OK).json({
            success: true,
            message: "User created",
            data: newUser,
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(httpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: "Invalid email and password. Please register first!",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = await getToken(user);
            res.cookie("token", token);
            return res.status(httpStatusCode.OK).json({
                success: true,
                message: "Successfully logged in!",
                data: {user,token},
            });
        } else {
            return res.status(httpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: "Invalid email or password!"
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong!",
            error: error.message,
        });
    }
};

module.exports = { userRegistration, userLogin };
