const bcrypt = require("bcrypt");
const httpStatusCode = require("../constant/httpStatuscode");
const userModel = require("../models/user");
const inputValidation = require("express-validator");
const jwt = require("jsonwebtoken");



const userRegistration = async (req, res) =>{
    // input validation incoming request from data
    try {
        const errors = inputValidation(req);
        if(!errors.isEmpty()){
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success:false,
                errors:errors.array(),
            });
        }

        const {fullName, email, password} = req.body;

        // Check existing email or not 
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(httpStatusCode.CONFLICT).json({
                success:false,
                message: "User is already registered with this email. Please login!"
            })
        }

        // Hashing password and create new user
        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) =>{
                let newUser = await userModel.create({
                    fullName,
                    email,
                    password:hash
                });

                let token = jwt.sign({email}, "shhhhhhhhhh")
                res.cookie("token", token);
                res.send(newUser);
            });
        });    
        
    } catch (error) {
        console.error("Registration error : ", error);
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
            success:false,
            message: "Something wents wrongs!",
            error:error.message,
        });
    }
};

const userLogin = async (req, res) =>{
    try {
        const errors = inputValidation(req);
        if(!errors.isEmpty()){
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success:false,
                errors:errors.array(),
            });
        }
    
    const {email, password} = req.body;
    let user = userModel.findOne({email});
    if(!user){
        return res.status(httpStatusCode.UNAUTHORIZED).json({
            success:false,
            message:"Invalid email and password. Please register first!",
        })
    }

    bcrypt.compare(password, user.password, async (err, result) =>{
        if(result){
            let token = jwt.sign({email:user.email}, "shhhhhhhhhh")
            res.cookie("token", token);
            res.status(httpStatusCode.OK).json({
                success:true,
                message:"Successfully logged in!"
            })
        }else{
            res.status(httpStatusCode.UNAUTHORIZED).json({
                success:false,
                message:"Something went wrong!"
            })
        }

    });

    } catch (error) {
        console.error("Login Error : ", error);
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
            success:false,
            message: "Something wents wrongs!",
            error:error.message,
        });
    }
}

module.exports = {userRegistration, userLogin};