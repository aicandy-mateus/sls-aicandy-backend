export const toCompaniesDTO = function(companiesResult: CompanyEntity[]): CompanyDTO[] {
  let companies: CompanyDTO[] = []

  for(let i = 0; i < companiesResult.length; i++) {
    const c: CompanyDTO = {
      name: companiesResult[i].name,
      cvm_code: companiesResult[i].cvm_code,
      idproducers: companiesResult[i].idproducers,
      tickers: []
    }

    if(companiesResult[i].ticker) c.tickers.push(companiesResult[i].ticker)
    if(companiesResult[i].ticker2) c.tickers.push(companiesResult[i].ticker2)
    
    companies.push(c)
  }

  return companies
}

export const toWebcastListDTO = function(webcasts: WebcastEntity[]): WebcastListDTO[] {
  let list: WebcastListDTO[] = []

  for(let i = 0; i < webcasts.length; i++) {
    const wc = {
      id: webcasts[i].id,
      quarter: webcasts[i].title_object.report_title
    }

    list.push(wc)
  }


  return list
}