const meetingController = require('../controllers/meeting.controller');
const express = require('express');
const router = express.Router();

router.post("/start", meetingController.startMeeting);
router.get("/join", meetingController.checkMeetingExists);
router.get("/get", meetingController.getAllMeetingUsers); //optional



module.exports = router;



// const express = require('express');
// const router = express.Router();
// const meetingController= require('../controllers/meeting.controller');


// router.route('/start').post(meetingController.startMeeting)
// router.route('/join').get(meetingController.checkMeetingExists)
// router.route('/get').get(meetingController.getAllMetingUsers)

// module.exports = router;