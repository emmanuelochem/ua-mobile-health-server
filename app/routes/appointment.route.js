const express = require('express');
const router = express.Router();
const {
    getAppointment,
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    checkAppointment,
    cancelAppointment,approveAppointment
    } = require('../controllers/appointment.controller');


router.route('/').get(getAppointments).post(createAppointment)
router.route('/:id').get(getAppointment).put(updateAppointment).delete(deleteAppointment)
router.route('/:doctor/:date').get(checkAppointment)
router.route('/cancel').patch(cancelAppointment)
router.route('/approve').patch(approveAppointment)
module.exports = router;