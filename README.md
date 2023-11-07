# -v1

This project allows you to take daily cognito user pool backups (without passwords) with a simple lambda function.

First build the project on your local computer and then deploy the lambda.
Note: Don't forgot to edit environment variables in Lambda.

[AWS Lambda Tutorial Video](https://www.youtube.com/watch?v=mhdX4znMd2Q&ab_channel=JonathanDavies).

[EventBridge (CloudWatch Events) Tutorial Video]([https://www.youtube.com/watch?v=mhdX4znMd2Q&ab_channel=JonathanDavies](https://www.youtube.com/watch?v=aDqxCYRDQNI&ab_channel=BeABetterDev)).

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```



[SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `cognito-s3-backup/tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests.

```bash
-v1$ cd cognito-s3-backup
cognito-s3-backup$ npm install
cognito-s3-backup$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name -v1
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
