const path = require('path');
require('dotenv').config();
let dic;
// dic = '/tmp'; //path.join(__dirname, `../../tmp/`);
if (process.env.DEV && process.env.DEV === 'Yes') {
    dic = path.join(__dirname, `../../tmp/`);
} else {
    dic = '/tmp/';
}
module.exports = async () => {

    var AWS = require('aws-sdk');
    AWS.config.update({ region: process.env.S3_REGION });
    var s3 = new AWS.S3({ apiVersion: process.env.API_VERSION });

    const { CronJob } = require('cron');
    const { backupUsers, restoreUsers } = require('cognito-backup-restore');

    const main_flow = new Promise(async (resolve, reject) => {
        /* GET BACKUP */
        try {
            console.log('user pool', process.env.USER_POOL_ID)
            const cognitoISP = new AWS.CognitoIdentityServiceProvider();
            return await backupUsers(cognitoISP, process.env.USER_POOL_ID, dic)
                .then(async () => {
                    try {
                        console.log(require(dic + process.env.USER_POOL_ID + '.json'));
                        await upload_to_s3(dic + process.env.USER_POOL_ID + '.json')
                    } catch (error) {
                        console.error(error.message)
                    }
                })
                .catch((error) => resolve(error))
        } catch (error) {
            console.error(error)
            resolve(error)
        }

        /* UPLOAD TO S3 */
        async function upload_to_s3(file_path) {

            var cognito_data = require(file_path);
            if (!cognito_data) return resolve('cognito_data not found!');

            const uploadParams = {
                Bucket: process.env.S3_BUCKET,
                Key: `backup_${(new Date().toJSON())}`,
                Body: JSON.stringify(cognito_data)
            };

            return await s3.upload(uploadParams, (error, data) => {
                console.log(error ? { message: e.message, error: error } : {
                    backup_status: 'Success',
                    Time: new Date(),
                    Key: `backup_${(new Date().toJSON())}.json`
                });
                return resolve(error ? error : data ? data : true);
            });
        }

    });

    const job = CronJob.from({
        // cronTime: '0 12 * * *',
        cronTime: '* * * * *',
        onTick: () => {
            main_flow
                .then((res) => {
                    // console.log('DONE', res);
                    return true;
                })
                .catch((err) => {
                    console.error(err);
                    return false;
                })
        },
        start: true,
        timeZone: 'America/Los_Angeles'
    });

}
/** 
 ** -NPM PACKAGES- **
 * sudo npm i cognito-backup-restore
 * sudo npm i dotenv
 * sudo npm i aws-sdk
 * sudo npm i cron
 * */