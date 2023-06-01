const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema(
    {
    hostId: {
        type: String,
        required: true,
    },
    hostName: {
        type: String,
        required: false,
    },
    startTime: {
        type: String,
        required: true,
    },
    meetingUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "MeetingUser"
            }
        ],
    },
    {
        toJSON: {
            transform: function(doc, ret){
            ret.id = ret._id.toString(),
            delete ret._id;
            delete ret.__v;
            }
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model('Meeting', meetingSchema);