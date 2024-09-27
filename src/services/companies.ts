import mysql, { ConnectionOptions } from 'mysql';

const access = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: 3306,
  database: process.env.DATABASE,
};

const connection = mysql.createConnection(access)

// export const getCompanies = async function(cvm_code?: number) {
//   return new Promise(async (res, rej) => {
//     try {
//       const access: ConnectionOptions = {
//         host: process.env.RDS_HOSTNAME,
//         user: process.env.RDS_USERNAME,
//         password: process.env.RDS_PASSWORD,
//         port: 3306,
//         database: process.env.DATABASE,
//         connectTimeout: 1000000000,
//         connectionLimit: 1000000000,
//       };
      
//       const connection = await mysql.createConnection(access)
  
//       const [ result ] = await connection.query(`SELECT name, cvm_code FROM producers`)

//       res(result)

//     } catch (error) {
//       console.log(error)
//       rej(error)
//     }

//     // (err, results) => {
//     //   if(err) return rej(err)
  
//     //   return res(results)
//     // }
//   })
// }


export const getCompanies = async function(cvm_code?: number) {
  return new Promise((result, rej) => {
    connection.query(`SELECT name, cvm_code FROM producers WHERE cvm_code = 11398`, (err, data) => {
      if(err) throw new Error();

      return result(data)
    })
  })
}
