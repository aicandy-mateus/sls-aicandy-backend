import serverless from 'serverless-http';
import express from 'express'
import AWS from 'aws-sdk'

import { getCompanies } from './services/companies';

// import mysql, { ConnectionOptions } from 'mysql2/promise';

// const access: ConnectionOptions = {
//   host: process.env.RDS_HOSTNAME,
//   user: process.env.RDS_USERNAME,
//   password: process.env.RDS_PASSWORD,
//   port: 3306,
//   database: process.env.DATABASE,
// };

// const connection = mysql.createPool(access)

const app = express()
app.use(express.json())
// const dynamoDb = new AWS.DynamoDB.DocumentClient()

app.get("/companies", async function (req, res, next) {
  try {
    // const [ result ] = await connection.execute('SELECT name, cvm_code FROM producers WHERE `cvm_code` = ?', [20613])
    const result = await getCompanies()
    console.log(result)
    return res.status(200).json({ data: 'teste'})
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
