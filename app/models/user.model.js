
const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema(
    {
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim:true
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    photo: {
        type: String,
        required: false,
    },
    is_student:{
        type: Boolean,
        required: true,
        default: false
    },
    user_type: {
        type: String,
        required: true,
        default: 'student',
    },
    biography: {
        type: String,
        required: false,
        max: 5000,
    },
    specialization: {
        type: String,
        required: false,
    },
    qualification: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
        max: 5000,
    },
    faculty: {
        type: String,
        required: false,
        max: 5000,
    },
    department: {
        type: String,
        required: false,
        max: 5000,
    },
    level: {
        type: String,
        required: false,
        max: 5000,
    },
    matric_no: {
        type: String,
        required: false,
        max: 5000,
    },
    
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', doctorSchema);