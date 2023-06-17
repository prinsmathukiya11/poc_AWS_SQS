const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
} = require("@aws-sdk/client-sqs");
const aws = require("aws-sdk");
require("dotenv").config();

const configobject = {
  region: process.env.aws_region,
  credentials: {
    accessKeyId: process.env.aws_access_key,
    secretAccessKey: process.env.aws_secret_key,
  },
};
const sqsClient = new SQSClient(configobject);

aws.config.update({
  secretAccessKey: process.env.aws_secret_key,
  accessKeyId: process.env.aws_access_key,
  region: process.env.aws_region,
});
const s3 = new aws.S3();

const dltMsg = async (ReceiptHandler) => {
  try {
    const data = await sqsClient.send(
      new DeleteMessageBatchCommand({
        QueueUrl: process.env.queueURL,
        ReceiptHandler: ReceiptHandler,
      })
    );
  } catch (error) {
    console.log("In Delete Error");
  }
};
const pollMsg = async () => {
  try {
    const command = new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      QueueUrl: process.env.queueURL,
      WaitTimeSeconds: 0,
      MessageAttributeNames: ["ALL"],
    });
    const result = await sqsClient.send(command);
    if (result.Messages == null) {
      console.log("no data");
      return;
    }
    var buf = Buffer.from(JSON.stringify(result.Messages));
    var data = {
      Bucket: process.env.aws_bucket,
      Key: `${Date.now()}.json`,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "application/json",
      //   ACL: "public-read",
    };

    s3.upload(data, function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error uploading data: ", data);
      } else {
        console.log("succesfully uploaded!!!");
      }
    });
    console.log(result.Messages);
    const del_result = await dltMsg(result.Messages[0].ReceiptHandler);
    console.log("Delete successfully");
  } catch (err) {
    console.log(err);
  }
};
setInterval(pollMsg, 5000);
