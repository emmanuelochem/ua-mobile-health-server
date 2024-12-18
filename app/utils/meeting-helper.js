
const meetingServices = require('../services/meeting-service');
const { MeetingPayloadEnum } = require('../utils/meeting-payload.enum');


async function joinMeeting(meetingId, socket, meetingServer, payload) {
   
    await meetingServices.isMeetingPresent(meetingId, async(error, results) => {
        if (error && !results) {
            sendMessage(socket, {
                type: MeetingPayloadEnum.NOT_FOUND
            });
        }

        if (results){
            const { userId, name } = payload.data;
      
           await addUser(socket, { meetingId, userId, name }).then((result) => {
                if (result) {
                    sendMessage(socket, {
                        type: MeetingPayloadEnum.JOINED_MEETING,
                        data: {
                            userId
                        }
                    });
                    broadcastUsers(meetingId, socket, meetingServer, {
                        type: MeetingPayloadEnum.USER_JOINED,
                        data: {
                            userId,
                            name,
                            ...payload.data
                        }
                    });
                }
            }, (error) => {
                console.log(error);
            });
        }
    });
}


function addUser(socket, { meetingId, userId, name }) {
    let promise = new Promise(async function(resolve, reject) {
       return  await meetingServices.getMeetingUser({ meetingId, userId }, (error, results) => {
            if (!results) {

                var model = {
                    socketId: socket.id,
                    meetingId: meetingId,
                    userId: userId,
                    joined: true,
                    name: name,
                    isAlive: true

                };
                meetingServices.joinMeeting(model, (error, results) => {
                    if (results) {
                       return resolve(true);

                    }
                    if (error) {
                        return reject(error);
                    }
                });
            } else {
                meetingServices.updateMeetingUser({
                    userId: userId,
                    socketId: socket.id,

                }, (error, results) => {
                    if (results) {
                        return   resolve(true);
                    }
                    if (error) {return reject(error); }
                });
            }
        });
    });
    return promise;

}

function sendMessage(socket, payload) {
    socket.send(JSON.stringify(payload));

}


function broadcastUsers(meetingId, socket, meetingServer, payload) {
    socket.broadcast.emit("message", JSON.stringify(payload));
}

function forwardConnectionRequest(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, name } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId,
    };
    meetingServices.getMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.CONNECTION_REQUEST,
                data: {
                    userId,
                    name,
                    ...payload.data
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    })
}


function forwardIceCandidate(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, candidate } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId,
    };
    meetingServices.getMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ICE_CANDIDATE,
                data: {
                    userId,
                    candidate,
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    })
}





function forwardOfferSDP(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, sdp } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId,
    };
    meetingServices.getMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.OFFER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    })
}

function forwardAnswerSDP(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, sdp } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId,
    };
    meetingServices.getMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ANSWER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit("message", sendPayload);
        }
    })
}

function userLeft(meetingId, socket, meetingServer, payload) {
    const { userId } = payload.data;
    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.USER_LEFT,
        data: {
            userId: userId
        }
    });
}


function endMeeting(meetingId, socket, meetingServer, payload) {
    const { userId } = payload.data;
    broadcastUsers(meetingId, socket, meetingServer, {
        type: MeetingPayloadEnum.MEETING_ENDED,
        data: {
            userId: userId
        }
    });
    meetingServices.getAllMeetingUsers(meetingId, (error, results) => {
        for (let i = 0; i < results.length; i++) {
            const meetingUser = results[i];
            meetingServer.sockets.connected[meetingUser.socketId].disconnect();
        }
    })
}



function forwardEvent(meetingId, socket, meetingServer, payload) {
    const { userId } = payload.data;
    broadcastUsers(meetingId, socket, meetingServer, {
        type: payload.type,
        data: {
            userId: userId,
            ...payload.data
        }
    });

}







module.exports = {

    joinMeeting,
    forwardConnectionRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSDP,
    userLeft,
    endMeeting,
    forwardEvent,


}




// const { error, result } = require('@hapi/joi/lib/base');
// const meetingServices = require('../services/meeting-service');
// const {MeetingPayloadEnum} = require('../utils/meeting.payload.enum');


// async function joinMeeting(meetingId, socket, meetingServer, payload){
//     const { userId, name} = payload.data;

//     await  meetingServices.isMeetingPresent(meetingId, async (error, results)=>{
//         if(error && !results){
//             sendMessage(socket, {
//                 type: MeetingPayloadEnum.NOT_FOUND
//             })
//         }
//         if(results){
//             await  addUSer(socket, {meetingId, userId, name})
//             .then((result)=>{
//                 sendMessage(
//                     socket,
//                     {
//                         type: MeetingPayloadEnum.JOINED_MEETING,
//                         data:{
//                             userId
//                         }
//                     }
//                 );

//                 //Notify other users that that a new use has joined
//                 broadcastUsers(meetingId, socket, meetingServer, {
//                     type: MeetingPayloadEnum.USER_JOINED,
//                     data:{
//                         userId,
//                         name,
//                         ...payload.data
//                     }
//                 })
//             }, (error)=>{
//                 console.log(error)
//             }
//             )
//         }
//     })

// }


//  function addUSer(socket, {meetingId, userId, name}){
//     let promise = new Promise(async function(resolve, reject){
//         await  meetingServices.getMeetingUser({
//             meetingId, userId
//         },
//         async (error, results)=>{
//             if(!results){
//                 var model = {
//                     socketId: socket.id,
//                     meetingId: meetingId,
//                     userId:userId,
//                     joined:true,
//                     name:name,
//                     isAlive: true
//                 };

//                 await    meetingServices.joinMeeting(model, (error, results)=>{
//                     if(results){
//                         resolve(true)
//                     }
//                     if(error){
//                         reject(error)
//                     }
//                 });
//             }
//             else{
//                 await  meetingServices.updateMeetingUser({
//                     userId:userId,
//                     socketId:socket.id
//                 },
//                 (error, results)=>{
//                     if(results){
//                         resolve(true)
//                     }
//                     if(error){
//                         reject(error)
//                     }
//                 })
//             }
//         })
//     })
//    return promise;
//  }


//  function sendMessage(socket, payload){
//     socket.socket(JSON.stringify(payload));
// }

// function broadcastUsers(meetingId, socket, meetingServer, payload){
//     socket.broadcast.emit("message", JSON.stringify(
//         payload
//     ))
// }

// async function forwardConnectionRequest(meetingId, socket, meetingServer, payload){
//     const {userId, otherUserId, name} = payload.data;

//     var model = {
//         meetingId: meetingId,
//         userId:otherUserId
//     };

//     await  meetingServices.getMeetingUser(model, async (error, results)=>{
//         if(results){
//             var sendPayload = Json.stringify(
//                {
//                  type: MeetingPayloadEnum.CONNECTION_REQUEST,
//                 data:{
//                     userId,
//                     name,
//                     ...payload.data
//                 }
//             });

//             await  meetingServer.to(results.socketId).emit('message', sendPayload);
//         }
//     })
// }


// async function forwardIceCandidate(meetingId, socket, meetingServer, payload){
//     const {userId, otherUserId, candidate} = payload.data;

//     var model = {
//         meetingId: meetingId,
//         userId:otherUserId
//     };

//     await  meetingServices.getMeetingUser(model, async (error, results)=>{
//         if(results){
//             var sendPayload = Json.stringify(
//                {
//                  type: MeetingPayloadEnum.ICECANDIDATE,
//                 data:{
//                     userId,
//                     candidate,
//                     // ...payload.data
//                 }
//             });

//             await  meetingServer.to(results.socketId).emit('message', sendPayload);
//         }
//     })
// }

// async function forwardOfferSDP(meetingId, socket, meetingServer, payload){
//     const {userId, otherUserId, sdp} = payload.data;

//     var model = {
//         meetingId: meetingId,
//         userId:otherUserId
//     };

//     await  meetingServices.getMeetingUser(model, async (error, results)=>{
//         if(results){
//             var sendPayload = Json.stringify(
//                {
//                  type: MeetingPayloadEnum.OFFER_SDP,
//                 data:{
//                     userId,
//                     sdp,
//                     //...payload.data
//                 }
//             });

//             await  meetingServer.to(results.socketId).emit('message', sendPayload);
//         }
//     })
// }

// async function forwardAnswerSDP(meetingId, socket, meetingServer, payload){
//     const {userId, otherUserId, sdp} = payload.data;

//     var model = {
//         meetingId: meetingId,
//         userId:otherUserId
//     };

//     await  meetingServices.getMeetingUser(model, async (error, results)=>{
//         if(results){
//             var sendPayload = Json.stringify(
//                {
//                  type: MeetingPayloadEnum.ANSWER_SDP,
//                 data:{
//                     userId,
//                     sdp,
//                     //...payload.data
//                 }
//             });

//             await  meetingServer.to(results.socketId).emit('message', sendPayload);
//         }
//     })
// }

// function userLeft(meetingId, socket, meetingServer, payload){
//     const {userId} = payload.data;

//     broadcastUsers(meetingId, socket, meetingServer, {
//         type: MeetingPayloadEnum.USER_LEFT,
//         data:{
//             userId:userId
//         }
//     })
// }

// async function endMeeting(meetingId, socket, meetingServer, payload){
//     const {userId} = payload.data;

//     broadcastUsers(meetingId, socket, meetingServer, {
//         type: MeetingPayloadEnum.MEETING_ENDED,
//         data:{
//             userId:userId
//         }
//     })
//     await  meetingServices.getAllMeetingUsers(meetingId, async (error, results)=>{
//         for (let i = 0; i < results.length; i++) {
//             const meetingUser = results[i];

//             await    meetingServer.sockets.connected(meetingUser.socketId).disconnect();
//         }
//     })
// }

// function forwardEvent(meetingId, socket, meetingServer, payload){
//     const {userId} = payload.data;

//     broadcastUsers(meetingId, socket, meetingServer, {
//         type: payload.type,
//         data:{
//             userId:userId,
//             ...payload.data
//         }
//     })
// }

// module.exports={
//     joinMeeting,
//     forwardConnectionRequest,
//     forwardIceCandidate,
//     forwardOfferSDP,
//     forwardAnswerSDP,
//     userLeft,
//     endMeeting,
//     forwardEvent
// }