const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName :{
        type: String,
        required: true,
    },
    email :{
        type: String,
        required: true, 
        unique: truea
    },
    password :{
        type: String,
        required: true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' // Assuming you have a Course schema/model
    }],
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' // Assuming you have a Course schema/model
    }],
})

module.exports = mongoose.model("User", userSchema);