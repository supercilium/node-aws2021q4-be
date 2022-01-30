import { middyfy } from '@libs/lambda';
import { S3Handler } from 'aws-lambda';
import { bucketServices } from 'src/services/bucket';
// import { pipeline } from 'stream';
import { HTTP_CODES, HTTP_CODES_TYPE } from '../../../../constants';
const csv = require('csv-parser')

const importProductsFile: S3Handler = async (event) => {
  const { Records } = event;
  let status: HTTP_CODES_TYPE = HTTP_CODES.SUCCESS;
  const res = []
  try {
    await Promise.all(Records.map(async element => {
      const object = await bucketServices.getObject(element);

      // pipeline(
      //   object.Body,
      //   csv(),
      //   process.stdout
      // )
      object.Body
        .pipe(csv())
        .on('data', data => res.push(data))
        .on('end', () => {
          console.log(res)
        })
    }));
  } catch (error) {
    console.log(error);
    status = HTTP_CODES.ERROR;
  }
}

export const main = middyfy(importProductsFile);
