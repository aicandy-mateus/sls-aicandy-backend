interface WebcastEntity {
  id: string,
  title_object: {
    report_title: string
    company_data: {
      idproducers: string
    }
  }
}

interface WebcastListDTO {
  id: string,
  quarter: string
}

interface CompanyEntity {
  name: string;
  cvm_code: number;
  ticker: string | null;
  ticker2: string | null;
  idproducers: number
}

interface CompanyDTO {
  name: string;
  cvm_code: number;
  idproducers: number
  tickers: string[]
}

interface CompanyListDTO {
  name: string;
  cvm_code: number;
  tickers: string[]
  webcasts: WebcastListDTO[]
}