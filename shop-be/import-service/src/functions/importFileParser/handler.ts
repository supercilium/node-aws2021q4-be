import { middyfy } from '@libs/lambda';
import { S3Handler } from 'aws-lambda';
import { bucketServices } from 'src/services/bucket';
import { stream } from 'src/services/stream';

import { PassThrough, pipeline } from 'stream';
const csv = require('csv-parser')

const importProductsFile: S3Handler = async (event) => {
  const { Records } = event;
  try {
    await Promise.all(Records.map(async element => {
      const object = await bucketServices.getObject(element);
      pipeline(
        object.Body,
        new PassThrough({ encoding: 'utf8', objectMode: false }),
        csv({ mapHeaders: ({ header }) => header.toLowerCase() }),
        stream.outputToQueue(),

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
  }
}

export const main = middyfy(importProductsFile);
