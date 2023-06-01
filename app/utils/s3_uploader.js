const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Set up AWS configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

// Create an instance of the S3 service
const s3 = new AWS.S3();

// Users can upload following file type
const fileValidation = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type, only Images are allowed!'
      ),
      false
    );
  }
};


// Set up multer and multerS3 for file uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },
    fileFilter: fileValidation,
    limits: {
      fileSize: 1024 * 1024 * process.env.UPLOAD_LIMIT  
    },
  })
});

const uploader = (fieldName)=>upload.single(fieldName);

// Export the upload middleware
module.exports = {
  s3Uploader: uploader
};
