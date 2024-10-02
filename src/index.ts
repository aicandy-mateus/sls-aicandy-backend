import serverless from 'serverless-http';
import express from 'express'

import { getCompanies, getFullWebcast, getWebcast } from './services/companies';

const app = express()
app.use(express.json())

interface CompaniesRequest extends express.Request{
  params: {
    cvm_code?: string
  }
}

interface WebcastsRequest extends express.Request{
  params: {
    cvm_code?: string,
    id?: string
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


    // Companies && webcasts
    const webcasts = await getWebcast()


    const companiesWithWebcasts = companies.map((comp, i) => {
      const companieWebcast = webcasts.Items?.filter((wc) => wc.title_object.company_data?.idproducers === comp.idproducers)

      return {
        ...comp,
        webcasts: companieWebcast
      } as CompanyWithWebcast
    })

    return res.status(200).json({ data: companiesWithWebcasts })
  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
});

app.get('/companies/:cvm_code/webcasts/:id?', async (req: WebcastsRequest, res) => {
  try {
    const { cvm_code, id } = req.params

    const companies = await getCompanies(cvm_code)

    if(cvm_code && companies.length === 0) {
      return res.status(404).json({
        data: [],
        message: "Company not found!"
      })
    }

    const company = companies[0]

    const webcasts = await getFullWebcast(company.idproducers)

    if(id && webcasts.Items?.length === 0) {
      return res.status(404).json({
        data: [],
        message: "Webcast not found!"
      })
    }

    if(id) {
      const wc = webcasts.Items?.find((wc) => wc.id === id)

      if(!!wc) {
        return res.status(200).json({
          data: {
            webcast: wc
          },
        })
      }

      return res.status(200).json({
        data: [],
        message: "Webcast not found!"
      })
    }

    return res.status(200).json({
      data: {
        webcasts: webcasts.Items
      }
    })
    
  } catch (error) {
    
  }
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
