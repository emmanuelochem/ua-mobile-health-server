const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
    student: {type: mongoose.Types.ObjectId, ref: "User",},
    doctor: {type: mongoose.Types.ObjectId, ref: "User",},
    rating: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        default:'',
        required: false,
        max: 1000,
    }, 
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Review', reviewSchema);
