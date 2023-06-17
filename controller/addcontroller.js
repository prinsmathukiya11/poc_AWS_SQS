const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const queueURL = process.env.queue_URL;
const configobject = {
  region: process.env.aws_region,
  credentials: {
    accessKeyId: process.env.aws_access_key,
    secretAccessKey: process.env.aws_secret_key,
  },
};

const sqsClient = new SQSClient(configobject);
module.exports.add = async (req, res) => {
  try {
    // console.log(req.body.message);
    const command = new SendMessageCommand({
      MessageBody: req.body.message,
      QueueUrl: queueURL,
      MessageAttributes: {
        OrderId: { DataType: "String", StringValue: req.body.OrderId },
      },
    });
    const result = await sqsClient.send(command);
    console.log("Added Successfully");
    res.status(202).send({ status: true, massage: result });
  } catch (error) {
    console.log("In Add Error");
    console.log(error);
  }
};
