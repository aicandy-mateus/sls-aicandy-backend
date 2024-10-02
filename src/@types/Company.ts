interface Webcast {
  id: string,
  title_object: {
    report_title: string
    company_data: {
      idproducers: string
    }
  }

}

interface Company {
  name: string;
  cvm_code: number;
  idproducers: number
  tickers: string[]
}

interface CompanyWithWebcast extends Company {
  webcasts: Webcast[]
}

interface CompanyDbReturned {
  name: string;
  cvm_code: number;
  ticker: string | null;
  ticker2: string | null;
  idproducers: number
}