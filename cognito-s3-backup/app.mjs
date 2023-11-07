import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

export const lambdaHandler = async (event, context) => {
    let response = { 'statusCode': 500, 'body': '' };

    try {
        const backup = require('./cognito_backup_to_s3.js');
        await new Promise(async (resolve, rej) => {
            await backup(resolve);
        }).then((res) => {
            response = {
                'statusCode': 200,
                'body': JSON.stringify({
                    message: 'hello world',
                    backup: res,
                })
            };
        })
    } catch (err) {
        console.error(err);
        response.body = err.message;
        response['error'] = JSON.stringify(err);
    }

    return response;
};
