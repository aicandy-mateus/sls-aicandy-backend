import serverless from 'serverless-http';
import express from 'express'

import { getCompanies, getFullWebcast } from './services/companies';

const app = express()
app.use(express.json())

interface CompaniesRequest extends express.Request{
  params: {
    cvm_code?: string
  }
}

app.get("/companies/:cvm_code?", async function (req: CompaniesRequest, res, next) {
  try {
    const cvm_code = req.params.cvm_code
    const companies = await getCompanies(cvm_code)

    if(cvm_code && companies.length === 0) {
      return res.status(404).json({
        data: [],
        message: "Company not found!"
      })
    }

    if(cvm_code) {
      const company = companies[0]


      const webcast = await getFullWebcast(company.idproducers)

      return res.status(200).json({
        data: {
          company_data: company,
          webcasts: webcast.Items
        },
      })
      
    }

    return res.status(200).json({ data: companies })
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
