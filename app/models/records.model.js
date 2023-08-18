const mongoose = require('mongoose');

const recordsSchema = mongoose.Schema(
    {
    student: {type: mongoose.Types.ObjectId, ref: "User",},
    doctor: {type: mongoose.Types.ObjectId, ref: "User",},
    appointment:{type: mongoose.Types.ObjectId, ref: "Appointment",},
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    colorId: {
        type: String,
        required: true,
    },
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Records', recordsSchema);
