import mysql2, { ConnectionOptions } from 'mysql2';
import AWS from 'aws-sdk'
import { toCompaniesDTO } from '../utils';

const dynamoDb = new AWS.DynamoDB.DocumentClient()

const access = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: Number(process.env.RDS_PORT),
  database: process.env.DATABASE,
};

const connection = mysql2.createConnection(access)



export const getCompanies = async function(cvm_code?: string): Promise<CompanyDTO[]> {
  return new Promise((res, rej) => {
    const QUERY = {
      allCompanies: `SELECT idproducers, name, cvm_code, ticker, ticker2 FROM producers WHERE cvm_code IS NOT NULL`,
      companieByCvmCode: `SELECT idproducers, name, cvm_code, ticker, ticker2 FROM producers WHERE cvm_code = ? AND cvm_code IS NOT NULL`
    }

    if(cvm_code) {
      connection.execute(QUERY.companieByCvmCode, [cvm_code], (err, data) => {
        if(err) throw new Error();
        
        const companiesDBResult = data as CompanyEntity[]

        const companies = toCompaniesDTO(companiesDBResult)

        return res(companies)
      })
    }

    connection.query(QUERY.allCompanies, (err, data) => {
      if(err) throw new Error();

      const companiesDBResult = data as CompanyEntity[]

      const companies = toCompaniesDTO(companiesDBResult)

      return res(companies)
    })
  })
}


export const getFullWebcast = async function(idProducer: number) {
  const params = {
    TableName: 'AiCandyReportTable',
    FilterExpression: 'title_object.company_data.idproducers = :value',
    ExpressionAttributeValues: {
      ':value': idProducer,
    },
  };


  const res = await dynamoDb.scan(params).promise();

  return res
}


export const getWebcast = async function(idProducer) {
  let params = {
    TableName: 'AiCandyReportTable',
    Select: 'SPECIFIC_ATTRIBUTES',
    ProjectionExpression: 'title_object.report_title, title_object.company_data.idproducers, id',
    FilterExpression: 'title_object.company_data.idproducers = :value',
    ExpressionAttributeValues: {
      ':value': idProducer,
    },
  };

  const res = await dynamoDb.scan(params).promise();

  return res
}