
var AWS = require('aws-sdk');
require('dotenv').config();

module.exports = async (callback) => new Promise(async (resolve, reject) => {

    /* GET BACKUP */
    try {
        if (
            !process.env.S3_REGION ||
            !process.env.API_VERSION ||
            !process.env.AWS_ACCESS_KEY_ID ||
            !process.env.AWS_SECRET_ACCESS_KEY ||
            !process.env.USER_POOL_ID ||
            !process.env.S3_BUCKET
        ) {
            console.log('\nMISSING .ENV FILE!');
            return resolve('MISSING .ENV FILE!');
        } else {
            AWS.config.update({
                region: process.env.S3_REGION,
                'accessKeyId': process.env.AWS_ACCESS_KEY_ID,
                'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY
            });
        }

        var s3 = new AWS.S3({ apiVersion: process.env.API_VERSION });


        return new Promise(async (res, rej) => {

            var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
            cognitoidentityserviceprovider.listUsers({
                UserPoolId: process.env.USER_POOL_ID
            }, async (err, data) => {
                if (err) {
                    console.error(err);
                    resolve(err);
                }
                else {
                    res(await upload_to_s3(data));
                }
            })
        });
    } catch (error) {
        console.error(error);
        resolve(error);
    }

    /* UPLOAD TO S3 */
    async function upload_to_s3(cognito_data) {

        if (typeof cognito_data !== 'object') {
            console.log('\nCOGNITO DATA not found!');
            return resolve('COGNITO DATA not found!');
        }

        const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: `backup_${(new Date().toJSON())}.json`,
            Body: JSON.stringify(cognito_data),
            ContentType: "application/json"
        };

        return s3.upload(uploadParams, (error, data) => {

            console.log(error ? {
                backup_status: 'Fail',
                message: error.message,
                error: error
            } : {
                backup_status: 'Success',
                Time: new Date(),
                Key: `backup_${(new Date().toJSON())}.json`
            });

            return resolve(error ? error : data ? data : 'DONE');
        });
    }

});

/** 
 ** -NPM PACKAGES- **
 * sudo npm i dotenv
 * sudo npm i aws-sdk
 * */
