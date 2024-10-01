export const transformCompaniesObject = function(companiesResult: CompanyDbReturned[]) {
  let companies: Company[] = []

  for(let i = 0; i < companiesResult.length; i++) {
    const c: Company = {
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