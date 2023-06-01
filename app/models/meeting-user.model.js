const mongoose = require('mongoose');

const meetingUserSchema = mongoose.Schema(
    {
    socketId: {
        type: String,
    },
    meetingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting"
    },
    userId: {
        type: String,
        required: true,
    },
    joined: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isAlive: {
        type: Boolean,
        required: true,
    },
},
    {timestamps:true}
    
);

module.exports = mongoose.model('MeetingUser', meetingUserSchema);