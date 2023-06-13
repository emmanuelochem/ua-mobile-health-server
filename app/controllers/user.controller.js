const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');
const uploadService = require('../utils/s3_uploader')



const getAllStudents = asyncHandler(async (req, res) => {
    const users = await User.find({is_student: true, user_type:'student'})
    const user_data = await userData(req.auth_id);
    return res.status(200).json({
        status: `success`,
        message: `Students retrieved`,
        data: users,
        userData:user_data
    });
})
const getAllDoctors = asyncHandler(async (req, res) => {
    const users = await User.find({is_student: false, user_type:'doctor'});
    const user_data = await userData(req.auth_id);
    return res.status(200).json({
        status: `success`,
        message: `Doctors retrieved`,
        data: users,
        userData:user_data
    });
}) 


const getUser = asyncHandler(async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const user_data = await userData(req.auth_id);
       return res.status(200).json({
           status: `success`,
           message: `User data retrieved`,
           data: user,
           userData:user_data
       });
       } catch (error) {
       return res.status(400).json({
           status: `failed`,
           message: `${error.message}`,
       });
       }
})


const getUserData = asyncHandler(async (req, res) => {
    try {
     const user = await User.findById(req.auth_id);
     if(!user){
        return res.status(400).json({
            status: `failed`,
            message: `User not found`,
        });
     }
     const user_data = await userData(user._id);
    return res.status(200).json({
        status: `success`,
        message: `User data retrieved`,
        data: user,
        userData:user_data
    });
    } catch (error) {
    return res.status(400).json({
        status: `failed`,
        message: `${error.message}`,
    });
    }
});

//USer payload
const userData = asyncHandler(async (userID) => {
    try {
    var data = new Object();
     const profile = await User.findById(userID);
     const appointments = await Appointment.find({$or: [{student: profile._id}, {doctor: profile._id}]}).populate('student doctor');
     const upcoming = await Appointment.find({status: 'pending', $or: [{student: profile._id}, {doctor: profile._id}]}).populate('student doctor');
     data['profile']= profile;
     data['appointments']= appointments;
     data['upcoming']= upcoming;
    return  data;
    } catch (error) {
    return error.message;
    }
});



const updateUser = asyncHandler(async (req, res) => {
    try{
        const userprofile = await User.findByIdAndUpdate(req.auth_id, {$set: req.body}, {new:true});
        const user_data = await userData(req.auth_id);
        return res.status(200).json({
            status: `success`,
            message: `Profile updated`,
            data: userprofile,
            userData: user_data,
        });
     } catch(error){
         return res.status(200).json({
             status: `failed`,
             message: `User not updated`,
             data: null,
             userData:user_data
         });
     }
 })

 
 const deleteUser = asyncHandler(async (req, res) => {
   
     try{
      const  user = await User.findById({_id: req.params.id});
      const user_data = await userData(req.auth_id);
          return res.status(200).json({
              status: `success`,
              message: `User deleted`,
              data: user,
              userData:user_data
          });
      } catch(error){
        const user_data = await userData(req.auth_id);
          return res.status(200).json({
              status: `failed`,
              message: `User not deleted`,
              data: [],
              userData:user_data
          });
      }
  })

 
  const updateProfile = asyncHandler(async (req, res, next) => {
      const upload =  uploadService.s3Uploader('photo');
       upload(req, res, async (err)=>{
        if (err) {
            return res.status(401).json({
                status: `failed`,
                message: `Upload failed`,
                data: err.message
            });
          } else {
            try {
            const userprofile = await User.findByIdAndUpdate(req.auth_id, {$set: {photo:req.file.location}}, {new:true});
            const user_data = await userData(req.auth_id);
            return res.status(200).json({
                status: `success`,
                message: `Profile picture updated`,
                data: userprofile,
                userData: user_data,
            });
        } catch (error) {
            return res.status(401).json({
                status: `failed`,
                message: `An error occured`,
                data: error.message,
            });
        }
        }
      }
      );
})

module.exports = {
    getAllStudents,
    getAllDoctors,
    getUser,
    getUserData,
    updateUser,
    deleteUser,
    updateProfile,
    userData
};