const CONSTANTS = require('../config/constants');
const AWS = require('aws-sdk');

//S3 Config
const s3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: CONSTANTS.AWS.ACCESS_KEY_ID,
    secretAccessKey: CONSTANTS.AWS.SECRET_ACCESS_KEY,
    region: CONSTANTS.AWS.REGION,
    endpoint: new AWS.Endpoint(CONSTANTS.AWS.ENDPOINT)
});

exports.upload = async (file, filename) => {

    const { originalname, buffer, encoding, mimetype, size } = file;

    let ext = originalname.split('.')[1];
    const fileName = `${filename}.${ext}`;
    let base64Image = Buffer.alloc(size, buffer.toString(), 'binary').toString('base64');
    const fileData = Buffer.alloc(size, base64Image, 'base64');

    var params = {
        Bucket: process.env.S3_BucketName,
        Key: fileName,
        Body: fileData,
        ACL: 'public-read',
        ContentEncoding: encoding,
        ContentType: mimetype,
    };

    return await s3.upload(params).promise();
};

exports.delete = async (fileName) => {

    var deleteParams = {
        Bucket: process.env.S3_BucketName,
        Key: fileName
    };

    return await s3.deleteObject(deleteParams);
};