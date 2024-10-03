import serverless from 'serverless-http';
import express from 'express'

import { getBalances, getBalancesIds, getCashFlowIds, getCompanies, getDividendsIds, getFullWebcast, getResultsIds, getWebcast } from './services/companies';
import { toWebcastListDTO } from './utils';
import webcastsRouter from './controllers/webcasts';

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

interface BalancesRequest extends express.Request{
  params: {
    cvm_code: string,
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
      const data = await Promise.all([
        getBalancesIds(company.idproducers),
        getCashFlowIds(company.idproducers),
        getDividendsIds(company.idproducers),
        getResultsIds(company.idproducers),
      ])

      const [balances, cashFlow, dividends, results] = data

      const webcast = await getFullWebcast(company.idproducers)

      return res.status(200).json({
        data: {
          company_data: company,
          balances: balances,
          cashFlow: cashFlow,
          dividends: dividends,
          results: results,
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
        webcasts: toWebcastListDTO(companieWebcast)
      }

    })

    return res.status(200).json({ data: companiesWithWebcasts })
  } catch (error) {
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


    if(id) {
      const webcasts = await getFullWebcast(company.idproducers)

      if(webcasts.Items?.length === 0) {
        return res.status(404).json({
          data: [],
          message: "Webcast not found!"
        })
      }
  
      const wc = webcasts.Items?.find((wc) => wc.id === id)
  
      if(!!wc) {
        return res.status(200).json({
          data: {
            webcast: wc
          },
        })
      }

      return res.status(404).json({
        data: [],
        message: "Webcast id not found!"
      })
    }


    const webcasts = (await getWebcast(company.idproducers)).Items
    const webcastList = toWebcastListDTO(webcasts)

    return res.status(200).json({
      data: {
        webcasts: webcastList
      }
    })
    
  } catch (error) {
    return res.status(500).send()
  }
})

app.get('/companies/:cvm_code/balances/:id?', async (req: BalancesRequest, res) => {
  try {
    const { cvm_code, id } = req.params

    console.log('cvm', cvm_code)
    let balances = await getBalances(cvm_code, id)

    if(id) {
      if(balances.length === 0) {
        return res.status(404).json({
          data: [],
          message: "Balances not found!"
        })
      }
  
      const balance = balances[0]
  
      if(!!balance) {
        return res.status(200).json({
          data: {
            balance: balance
          },
        })
      }

      return res.status(404).json({
        data: [],
        message: "Balance not found!"
      })
    }


    return res.status(200).json({
      data: {
        balances: balances
      }
    })
    
  } catch (error) {
    return res.status(500).send()
  }
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
