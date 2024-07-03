const bcrypt = require("bcrypt");
const httpStatusCode = require("../constant/httpStatuscode");
const userModel = require("../models/user");
const {validationResult} = require("express-validator");
const {getToken} = require("../middleware/auth")



const userRegistration = async (req, res) =>{
    // input validation incoming request from data
    try {
        const errors = validationResult(req);
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
                return res.status(httpStatusCode.OK).json({
                    success:true,
                    message:"User created",
                    data: newUser,
                })
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

// ```````````````````````````````````````````````````````````````````user Login ````````````````````````````````````````````````````````````
const userLogin = async (req, res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success:false,
                errors:errors.array(),
            });
        }
    
    const {email, password} = req.body;
    let user = await userModel.findOne({email});
    console.log(email, password,);
    if(!user){
        return res.status(httpStatusCode.UNAUTHORIZED).json({
            success:false,
            message:"Invalid email and password. Please register first!",
        })
    }

    bcrypt.compare(password, user.password, async (err, result) =>{
        if(result){
            const token = await getToken(user);
            res.cookie("token", token);
            res.status(httpStatusCode.OK).json({
                success:true,
                message:"Successfully logged in!",
                data:user,
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