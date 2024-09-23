import serverless from 'serverless-http';
import express from 'express'
import AWS from 'aws-sdk'

const app = express()
app.use(express.json())
const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.get("/companies", async (req, res, next) => {
  // const params = {
  //   TableName: 'AiCandyReportTable',
  //   FilterExpression: 'transcription_id = :value',
  //   ExpressionAttributeValues: {
  //     ':value': 5850,
  //   },
  // };

  try {
    // const result = await dynamoDb.scan(params).promise()
    
    return res.status(200).json({
      data: {
        companies: []
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      data: error,
    });
  }
});

app.get("/private", async (req, res, next) => {
  const params = {
    TableName: 'AiCandyReportTable',
  };

  try {
    const result = await dynamoDb.scan(params).promise()
    
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(200).json({
      data: error,
    });
  }

  return res.status(200).json({
    message: "AiCandy API V1 | Private route",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
