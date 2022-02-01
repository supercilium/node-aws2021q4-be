import { middyfy } from '@libs/lambda';
import { S3Handler } from 'aws-lambda';
import { bucketServices } from 'src/services/bucket';
import { stream } from 'src/services/stream';

import { pipeline } from 'stream';
import { HTTP_CODES, HTTP_CODES_TYPE } from '../../../../constants';
const csv = require('csv-parser')

const importProductsFile: S3Handler = async (event) => {
  console.log(event.Records[0].s3)
  const { Records } = event;
  let status: HTTP_CODES_TYPE = HTTP_CODES.SUCCESS;
  try {
    await Promise.all(Records.map(async element => {
      const object = await bucketServices.getObject(element);
      console.log(object)
      pipeline(
        object.Body,
        csv(),
        // stream.outputToDB(),
        // stream.outputToQueue(),

        (err) => {
          if (err) {
            console.error('Failed ', err);
          } else {
            console.log('Completed')
          }
        }
      )

    }));
  } catch (error) {
    console.log(error);
    status = HTTP_CODES.ERROR;
  }
}

export const main = middyfy(importProductsFile);
