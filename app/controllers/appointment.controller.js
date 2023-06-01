const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointment.model');
const userController = require("../controllers/user.controller");

const getAppointments = asyncHandler(async (req, res) => {
    try{
        const appointment = await Appointment.find().populate("student doctor");
        const user_data = await userController.userData(req.auth_id);
        return res.status(200).json({
            status: `success`,
            message: `Appointments retrieved`,
            data: appointment,
            userData:user_data

        });
    } catch(error){
        const user_data = await userController.userData(req.auth_id);
        return res.status(200).json({
            status: `failed`,
            message: `${error.message}`,
            data: [],
            userData:user_data
        });
    }
}) 

const getAppointment = asyncHandler(async (req, res) => {
   try{
    const appointment = await Appointment.findById({_id: req.params.id}).populate("student doctor");
    const user_data = await userController.userData(req.auth_id);
        return res.status(200).json({
            status: `success`,
            message: `Appointment retrieved`,
            data: appointment,
            userData:user_data
        });
    } catch(error){
        const user_data = await userController.userData(req.auth_id);
        return res.status(200).json({
            status: `failed`,
            message: `Appointment not retrieved`,
            data: null,
            userData:user_data
        });
    }
}) 



const checkAppointment = asyncHandler(async (req, res) => {
    try{
     const appointment = await Appointment.find({doctor: req.params.doctor, date: req.params.date, status: {$nin : ["cancelled", "completed"]}});
     const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `success`,
             message: `Appointment retrieved`,
             data: appointment,
             userData:user_data
         });
     } catch(error){
        const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `failed`,
             message: `${error.message}`,
             data: null,
             userData:user_data
         });
     }
 })


const createAppointment = asyncHandler(async (req, res) => {
  try {
    const appointmentExist = await Appointment.find({date: req.body.date, time: req.body.time, status: {$nin : ["cancelled", "completed"]}});
   if(appointmentExist.length > 0){
    return res.status(400).json({
        status: `error`,
        message: `An appointment for this date and time already exists.`,
        appointmentExist
    });
   }

    const appointment = new Appointment({
        student: req.auth_id,
        doctor: req.body.doctor,
        date: req.body.date,
        time: req.body.time,
        status: req.body.status,
        note: req.body.note,
      })
       await appointment.save();
       const appointment_data = await Appointment.findById(appointment._id).populate("student doctor");
       const user_data = await userController.userData(req.auth_id);
       return res.status(201).json({
            status: `success`,
            message: `Appointment booked.`,
            data:appointment_data,
            userData:user_data
        });
  } catch (error) {
    const user_data = await userController.userData(req.auth_id);
    res.status(201).json({
        status: `failed`,
        message: `Unable to make appointment.`,
        data: null,
        userData:user_data
    });
  }

})


const updateAppointment = asyncHandler(async (req, res) => {
   try{
    const appointment = await Appointment.findById({_id: req.params.id});
    const user_data = await userController.userData(req.auth_id);
        return res.status(200).json({
            status: `success`,
            message: `Doctor retrieved`,
            data: appointment,
            userData:user_data
        });
    } catch(error){
        const user_data = await userController.userData(req.auth_id);
        return res.status(200).json({
            status: `failed`,
            message: `Appointments not retrieved`,
            data: null,
            userData:user_data
        });
    }
})


const cancelAppointment = asyncHandler(async (req, res) => {
    try{
        const appointmentExist = await Appointment.find({_id: req.body.appointmentId, student: req.body.doctorId, student: req.body.studentId, });
        if(appointmentExist.length == 0){
         return res.status(400).json({
             status: `error`,
             message: `Appointment not found.`,
             data: null
         });
        }

    await Appointment.findByIdAndUpdate(req.body.appointmentId, {$set: { status : req.body.status}});
    const appointment =  await Appointment.findById({_id: req.body.appointmentId}).populate("student doctor")
    const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `success`,
             message: `Appointment Cancelled`,
             data: appointment,
             userData:user_data
         });
     } catch(error){
        const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `failed`,
             message: `Appointment not cancelled`,
             data: null,
             userData:user_data
         });
     }
 });

 const approveAppointment = asyncHandler(async (req, res) => {
    try{
        const appointmentExist = await Appointment.find({_id: req.body.appointmentId, doctor: req.body.doctorId, student: req.body.studentId, });
        if(appointmentExist.length == 0){
         return res.status(400).json({
             status: `error`,
             message: `Appointment not found.`,
             data: null
         });
        }

    await Appointment.findByIdAndUpdate(req.body.appointmentId, {$set: { status : req.body.status}});
    const appointment =  await Appointment.findById({_id: req.body.appointmentId}).populate("student doctor")
    const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `success`,
             message: `Appointment Approved`,
             data: appointment,
             userData: user_data
         });
     } catch(error){
        const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `failed`,
             message: `Appointment not approved`,
             data: null,
             userData: user_data
         });
     }
 })

 const deleteAppointment = asyncHandler(async (req, res) => {
    try{
     const appointment = await Appointment.findById({_id: req.params.id});
     const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `success`,
             message: `Appointment deleted`,
             data: appointment,
             userData: user_data
         });
     } catch(error){
        const user_data = await userController.userData(req.auth_id);
         return res.status(200).json({
             status: `failed`,
             message: `Appointment not deleted`,
             data: null,
             userData: user_data,
         });
     }
 })

module.exports = {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    checkAppointment,
    cancelAppointment, approveAppointment
  };