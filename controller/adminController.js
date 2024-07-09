const bcrypt = require("bcrypt");
const httpStatuscode = require("../constant/httpStatuscode");
const { getToken } = require("../middleware/authMiddleware");
const adminModel = require("../models/adminModel");


const adminRegister = async (req, res) => {
    try {

        const {fullName, email, password,} = req.body; 
        if(!email || !password){
            return res.status(httpStatuscode.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"You must have to fill all field!"
            })
        }

        const existingAdmin = await adminModel.findOne({email});

        if(existingAdmin){
            return res.status(httpStatuscode.CONFLICT).json({
                success:false,
                message:"This email has already register"
            })
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const admin = await adminModel.create({
            fullName,
            email,
            password: hashPassword,
            role:"admin",
        })
        
        return res.status(httpStatuscode.OK).json({
            success:true,
            message:"Admin Registerted!",
            data:admin,
        })
        
    } catch (error) {
        return res.status(httpStatuscode.BAD_REQUEST).json({
            success: false,
            message: "Something went wrong while registering",
            error: error.message,
        });
    }
}

const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(httpStatuscode.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"You must have to filled all input!",
            })
        }

        const admin = await adminModel.findOne({email});

        if(!admin){
            return res.status(httpStatuscode.BAD_REQUEST).json({
                success:false,
                message:"User not exist!",
            })
        }

        const validPassword = await bcrypt.compare(password, admin.password)
        if(!validPassword){
            return res.status(httpStatuscode.BAD_REQUEST).json({
                success:false,
                message:"Email or password is incorrect !"
            })
        }

        const token = getToken(admin);
        return res.status(httpStatuscode.OK).json({
            success:true,
            message:"Successfully Loggedin",
            data:{admin, token}
        })

    } catch (error) {
        return res.status(httpStatuscode.BAD_REQUEST).json({
            success: false,
            message: "Something went wrong while registering",
            error: error.message,
        });
    }
}

module.exports = {adminRegister, adminLogin}