const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
    student: {type: mongoose.Types.ObjectId, ref: "User",},
    doctor: {type: mongoose.Types.ObjectId, ref: "User",},
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true,
    }, 
    status: {
        type: String,
        default:'pending',
        required: true
    },
    note: {
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


// appointmentSchema.virtual('doctor', {
//     ref: 'Doctor',
//     localField: 'doctor_id', 
//     foreignField: '_id',
//     justOne: true
// });
// appointmentSchema.virtual('student', {
//     ref: 'Student',
//     localField: 'student_id', 
//     foreignField: '_id',
//     justOne: true
// });
// appointmentSchema.set('toObject', { virtuals: true });
// appointmentSchema.set('toJSON', { virtuals: true });

// appointmentSchema.set('toJSON', {
//     transform: function(doc, ret, options) {   
//         if (mongoose.Types.ObjectId.isValid(ret.home)) {
//             ret.doctor_id = ret.home;
//             delete ret.home;
//         }
//     }
// });

module.exports = mongoose.model('Appointment', appointmentSchema);