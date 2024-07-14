const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    required: true,
  },
  course :[],
}, { timestamps: true });

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;
