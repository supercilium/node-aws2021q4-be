import { middyfy } from '@libs/lambda';
import { GetObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { S3Handler } from 'aws-lambda';
import { REGION } from '@libs/constants';
const csv = require('csv-parser')

const importProductsFile: S3Handler = async (event) => {
  const { Records } = event;
  const s3 = new S3({ region: REGION });
  let status = 200;
  const res = []

  try {
    await Promise.all(Records.map(async element => {
      const { s3: { object: { key } } } = element;
      const params: GetObjectCommandInput = { Bucket: process.env.BUCKET_NAME, Key: key }

      const object = await s3.getObject(params);

      object.Body
        .pipe(csv())
        .on('data', data => res.push(data))
        .on('end', () => {
          console.log(res)
        })
    }));
  } catch (error) {
    console.log(error);
    status = 500;
  }
}

export const main = middyfy(importProductsFile);
