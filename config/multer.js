const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/aws_config.json');
// aws.config.region = 'ap-northeast-2'; //Seoul
//     aws.config.update({
//       accessKeyId: "AKIAJEDTLATVTJ23IW4Q",
//       secretAccessKey: "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"
//     });
const s3 = new aws.S3();

const upload = multer({
    /*storage: multerS3({
        s3: s3,
        bucket: 'weatherook',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })*/
});

module.exports = upload;