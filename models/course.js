const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    duration:{
        type:String,
        required:true,
    },
    lessonNumber:{
        type:String,
        required:true,
    },
    
});

const partSchema = new mongoose.Schema({
    
})