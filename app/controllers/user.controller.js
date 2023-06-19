const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');
const uploadService = require('../utils/s3_uploader');
const reviewModel = require('../models/review.model');
const userController = require("../controllers/user.controller");
const recordsModel = require('../models/records.model');



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
 
const likeUnlike = asyncHandler( async(req, res) => {
    try {
        const currentUserId = req.auth_id
        const user = await User.findById(req.params.id)

        // if the user has already liked the post, remove it.
        // Otherwise, add him into the likes array
        if(user.likes.includes(currentUserId)){
            user.likes = user.likes.filter((id) => id !== currentUserId)
           await user.save()
           return res.status(200).json({
            status: `success`,
            message: `Successfully unliked the user`,
            data:user
        });
        } else {
           user.likes.push(currentUserId)
           await user.save()
           return res.status(200).json({
            status: `success`,
            message: `Successfully liked the user`,
            data:user
        });
        }
    } catch (error) {
        return res.status(500).json(error.message) 
    }
})

const createReview = asyncHandler(async (req, res) => {
   
   
    try {
    //   const reviewExist = await reviewModel.find();
    //  if(reviewExist.length > 0){
    //   return res.status(400).json({
    //       status: `error`,
    //       message: `You have already  made a review`,
    //       reviewExist
    //   });
    //  }
  
      const review = new reviewModel({
          student: req.auth_id, doctor: req.body.doctor, rating: req.body.rating, message: req.body.message,
        })
         await review.save();
         const review_data = await reviewModel.findById(review._id).populate("student");
         const user_data = await userData(req.auth_id);
         return res.status(201).json({
              status: `success`,
              message: `Review made.`,
              data:review_data,
             userData:user_data
          });
    } catch (error) {
        const user_data = await userData(req.auth_id);
      res.status(201).json({
          status: `failed`,
          message: `Unable to make review.`,
          data: null,
          userData:user_data
      });
    }
  })

  const getReview = asyncHandler(async (req, res) => {
    try {
         const reviewExist = await reviewModel.find({doctor: req.params.id}).populate("student");
         //const user_data = await userData(req.auth_id);
         return res.status(200).json({
              status: `success`,
              message: `Review retrieved.`,
              data:reviewExist,
            // userData:user_data
          });
    } catch (error) {
        //const user_data = await userData(req.auth_id);
      res.status(201).json({
          status: `failed`,
          message: `Unable to fetch reviews.`,
          data: null,
         // userData:user_data
      });
    }
  })



  const createRecord = asyncHandler(async (req, res) => {
   
   
    try {
    //   const reviewExist = await reviewModel.find();
    //  if(reviewExist.length > 0){
    //   return res.status(400).json({
    //       status: `error`,
    //       message: `You have already  made a review`,
    //       reviewExist
    //   });
    //  }
      const review = new recordsModel({
                doctor: req.auth_id,
                student: req.body.student,
                appointment: req.body.appointment,
                title: req.body.title,
                body: req.body.body,
        })
         await review.save();
         const review_data = await recordsModel.findById(review._id).populate("student doctor");
         const user_data = await userData(req.auth_id);
         return res.status(201).json({
              status: `success`,
              message: `Record successfully created.`,
              data:review_data,
             userData:user_data
          });
    } catch (error) {
        const user_data = await userData(req.auth_id);
      res.status(201).json({
          status: `failed`,
          message: `Unable to create record.`,
          data: error.message,
          userData:user_data
      });
    }
  })





module.exports = {
    getAllStudents,
    getAllDoctors,
    getUser,
    getUserData,
    updateUser,
    deleteUser,
    updateProfile,
    userData,
    likeUnlike,
    createReview,
    getReview,
    createRecord
};