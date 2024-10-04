import serverless from 'serverless-http';
import express from 'express'

import { getBalances, getBalancesIds, getCashFlowsIds, getCashFlows, getCompanies, getDividendsIds, getFullWebcast, getResultsIds, getWebcast, getDividends, getResults } from './services/companies';
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
        getCashFlowsIds(company.idproducers),
        getDividendsIds(company.idproducers),
        getResultsIds(company.idproducers),
      ])

      const [balances, cashFlow, dividends, results] = data

      const webcast = await getFullWebcast(company.idproducers)

      return res.status(200).json({
        data: {
          company_data: company,
          webcasts: webcast.Items,
          balances: balances,
          cashFlows: cashFlow,
          dividends: dividends,
          results: results
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

app.get('/companies/:cvm_code/cash_flows/:id?', async (req: BalancesRequest, res) => {
  try {
    const { cvm_code, id } = req.params


    let cashFlows = await getCashFlows(cvm_code, id)

    if(id) {
      if(cashFlows.length === 0) {
        return res.status(404).json({
          data: [],
          message: "Cash flows not found!"
        })
      }
  
      const cashFlow = cashFlows[0]
  
      if(!!cashFlow) {
        return res.status(200).json({
          data: {
            cash_flow: cashFlow
          },
        })
      }

      return res.status(404).json({
        data: [],
        message: "Cash flow not found!"
      })
    }


    return res.status(200).json({
      data: {
        cash_flows: cashFlows
      }
    })
    
  } catch (error) {
    return res.status(500).send()
  }
})

app.get('/companies/:cvm_code/dividends/:id?', async (req: BalancesRequest, res) => {
  try {
    const { cvm_code, id } = req.params


    let dividends = await getDividends(cvm_code, id)

    if(id) {
      if(dividends.length === 0) {
        return res.status(404).json({
          data: [],
          message: "Dividends not found!"
        })
      }
  
      const dividend = dividends[0]
  
      if(!!dividend) {
        return res.status(200).json({
          data: {
            dividend: dividend
          },
        })
      }

      return res.status(404).json({
        data: [],
        message: "Dividends not found!"
      })
    }


    return res.status(200).json({
      data: {
        dividends: dividends
      }
    })
    
  } catch (error) {
    return res.status(500).send()
  }
})

app.get('/companies/:cvm_code/results/:id?', async (req: BalancesRequest, res) => {
  try {
    const { cvm_code, id } = req.params


    let results = await getResults(cvm_code, id)

    if(id) {
      if(results.length === 0) {
        return res.status(404).json({
          data: [],
          message: "Company's results not found!"
        })
      }
  
      const companyResult = results[0]
  
      if(!!companyResult) {
        return res.status(200).json({
          data: {
            result: companyResult
          },
        })
      }

      return res.status(404).json({
        data: [],
        message: "Company's results not found!"
      })
    }


    return res.status(200).json({
      data: {
        results: results
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
