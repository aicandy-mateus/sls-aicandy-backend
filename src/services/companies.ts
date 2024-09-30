import mysql2, { ConnectionOptions } from 'mysql2';

const access = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: Number(process.env.RDS_PORT),
  database: process.env.DATABASE,
};

const connection = mysql2.createConnection(access)

// interface Company {
//   name: string;
//   cvm_code: number;
//   ticker: string | null;
//   ticker2: string | null
// }

export const getCompanies = async function(cvm_code?: string) {
  return new Promise((res, rej) => {
    const QUERY = {
      allCompanies: `SELECT name, cvm_code, ticker, ticker2 FROM producers`,
      companieByCvmCode: `SELECT name, cvm_code, ticker, ticker2 FROM producers WHERE cvm_code = ?`
    }

    if(cvm_code) {
      connection.execute(QUERY.companieByCvmCode, [cvm_code], (err, data) => {
        if(err) throw new Error();
        
        return res(data[0])
      })
    }

    connection.query(QUERY.allCompanies, (err, data) => {
      if(err) throw new Error();
      return res(data)
    })
  })
}
