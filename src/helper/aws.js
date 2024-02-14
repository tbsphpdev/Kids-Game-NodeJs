const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const multer = require('multer');
const multerS3 = require("multer-s3");

dotenv.config();

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: 'us-west-2'
});

const s3 = new AWS.S3();

const upload = multer({
    //fileFilter,
    storage: multerS3({
      acl: "public-read",
      s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
       // req.params.type = req.params.type ? req.params.type : 'users';
        cb(null, Date.now().toString()+file.originalname);
      },
    }),
});

module.exports = upload;