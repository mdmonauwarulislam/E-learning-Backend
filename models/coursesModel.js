const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    weekDuration: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        required: true,
    },

    subCourse: [{
        part: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        courseLesson: [{
            lessonTitle: {
                type: String,
                required: true,
            },
            lessonNumber: {
                type: String,
                required: true,
            },
            lessonDuration: {
                type: String,
                required: true,
            },
            lessonVideoUrl: {
                type: String,
                required: true,
            },

        }]
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },




}, { timestamps: true });


module.exports = mongoose.model("Course", courseSchema);
