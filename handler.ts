import serverless from 'serverless-http';
import express from 'express'

const app = express()
app.use(express.json())

app.get("/public", (req, res, next) => {
  return res.status(200).json({
    message: "AiCandy API V1 | Public route",
  });
});

app.get("/private", (req, res, next) => {
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
