const meetingServices = require('../services/meeting-service')


exports.startMeeting = (req, res, next) => {
    const {
        hostId,
        hostName
    } = req.body;
    var model = {
        hostId: hostId,
        hostName: hostName,
        startTime: Date.now()

    };
    meetingServices.startMeeting(model, (error, results) => {
        if (error) {
              return res.status(500).send(
                {
                    status:`failed`,
                    message: error.message,
                    data: null
                }
            )
        }
        return res.status(200).send(
            {
                status:`success`,
                message: "Meeting Created",
                data: results.id
            }
        )
    })
}
exports.checkMeetingExists = (req, res, next) => {
    const { meetingId } = req.query;
    meetingServices.checkMeetingExists(meetingId, (error, results) => {
        if (error) {
        return res.status(500).send(
                    {
                        status:`failed`,
                        message: error.message,
                        data: null
                    }
                )
            }
            return res.status(200).send(
                {
                    status:`success`,
                    message: "Success",
                    data: results
                }
            )
    })
}
exports.getAllMeetingUsers = (req, res, next) => {
    const { meetingId } = req.query;
    meetingServices.getAllMeetingUsers(meetingId, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({ message: "Success", data: results });
    });
}

// const startMeeting = async (req, res, next)=>{
//     const {hostId, hostName}= req.body;

//     var model = {
//         hostId: hostId,
//         hostName:hostName,
//         startTime: Date.now()
//     }; 

//     await meetingServices.startMeeting(model, (error, results)=>{
//         if(error){
//             return res.status(500).send(
//                 {
//                     status:`failed`,
//                     message: error.message,
//                     data: null
//                 }
//             )
//         }
//         return res.status(200).send(
//             {
//                 status:`success`,
//                 message: "Meeting Created",
//                 data: results.id
//             }
//         )
//     })
// }

// const checkMeetingExists = async (req, res, next)=>{
//     const {meetingId}= req.query;

//     await  meetingServices.checkMeetingExists(meetingId, (error, results)=>{
//         if(error){
//             return res.status(500).send(
//                 {
//                     status:`failed`,
//                     message: error.message,
//                     data: null
//                 }
//             )
//         }
//         return res.status(200).send(
//             {
//                 status:`success`,
//                 message: "Success",
//                 data: results
//             }
//         )
//     })
// }

// const getAllMetingUsers = async (req, res, next)=>{
//     const {meetingId}= req.query;

//     await  meetingServices.getAllMeetingUsers(meetingId, (error, results)=>{
//         if(error){
//             return next(error);
//         }
//         return res.status(200).send(
//             {
//                 message: "Success",
//                 data: results
//             }
//         )
//     })
// }





// module.exports = {
//     startMeeting,
//     checkMeetingExists,
//     getAllMetingUsers
// }