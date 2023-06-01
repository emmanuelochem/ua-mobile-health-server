const router = require('express').Router()
const User = require('../models/user.model');
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {registerSchema, loginSchema} = require('../validators/authValidators');

const userController = require("../controllers/user.controller");

//USERS
router.post('/register', async(req, res) => {
  const { error } = Joi.object(req.body.is_student ? {
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(11).max(15).required(),
    is_student: Joi.bool().required(),
    user_type:Joi.string().required(),
    matric_no: Joi.string().required(),
    faculty: Joi.string().required(),
    department: Joi.string().required(),
    level: Joi.string().required(),
    biography: Joi.allow(),
    qualification: Joi.allow(),
    specialization: Joi.allow(),
    address: Joi.allow(),
  } : {
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(11).max(15).required(),
    is_student: Joi.bool().required(),
    user_type:Joi.string().required(),
    qualification: Joi.string().required(),
    specialization: Joi.string().required(),
    biography: Joi.string().required(),
    address: Joi.string().required(),
    matric_no: Joi.allow(),
    faculty: Joi.allow(),
    department: Joi.allow(),
    level: Joi.allow(),
  }).validate(req.body);
  if (error) return res.status(400).send({message:error.details[0].message});

  try {
    const isExisting = await User.findOne({email: req.body.email})
    
    if(isExisting){
      return res.status(500).json({msg: "Email is already taken."})
    }

   //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const savedDoctor = await User.create({...req.body, password: hashedPassword})
   
    const {password, ...others} = savedDoctor._doc
   
    const token = jwt.sign({id: savedDoctor._id}, process.env.JWT_SECRET, {expiresIn: `${process.env.JWT_SECRET_VALIDITY}`})
    const user_data = await userController.userData(others._id);
    return  res.status(201).json({
      status: `success`,
      message: `User created`,
      user: others,
      token: token,
      userData:user_data
  });
  } catch (error) {
      return res.status(500).json(
        {
          status: `error`,
          message:  error.message,
        
      })
  }
})



router.post("/login", async(req, res) => {
const { error } = loginSchema.validate(req.body);
if (error) return res.status(400).send({message:error.details[0].message});

  try {
     const doctor = await User.findOne({email: req.body.email}).select(["+password"]) 
     if(!doctor){
      return res.status(500).json({status: `error`, message: 'Invalid email or password.'})
     }

     const comparePass = await bcrypt.compare(req.body.password, doctor.password)
     if(!comparePass){
      return res.status(500).json({status: `error`, message: 'Invalid email or password.'})
     }

     const {password, ...others} = doctor._doc
     const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET, {expiresIn: `${process.env.JWT_SECRET_VALIDITY}`})
    const user_data = await userController.userData(others._id);
    return  res.status(200).json({
      status: `success`,
      message: `Login successful`,
      user: others,
      token,
      userData:user_data
  });
  } catch (error) {
    return res.status(500).json(
      {
        status: `failed`,
        message:  error.message,
      
    })
  }
})

module.exports = router