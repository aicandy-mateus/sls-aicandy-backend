import serverless from 'serverless-http';
import express from 'express'
import AWS from 'aws-sdk'

import { getCompanies } from './services/companies';

const app = express()
app.use(express.json())
// const dynamoDb = new AWS.DynamoDB.DocumentClient()

interface CompaniesRequest extends express.Request{
  params: {
    cvm_code?: string
  }
}

app.get("/companies/:cvm_code?", async function (req: CompaniesRequest, res, next) {
  try {
    const cvm_code = req.params.cvm_code
    console.log('CVM_CODE', cvm_code)
    const result = await getCompanies(cvm_code)

    // if(result.length === 0) {
    //   return res.status(404).json({
    //     data: result,
    //     message: "Company not found!"
    //   })
    // }

    return res.status(200).json({ data: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
