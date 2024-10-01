interface Company {
  name: string;
  cvm_code: number;
  idproducers: number
  tickers: string[]
}

interface CompanyDbReturned {
  name: string;
  cvm_code: number;
  ticker: string | null;
  ticker2: string | null;
  idproducers: number
}