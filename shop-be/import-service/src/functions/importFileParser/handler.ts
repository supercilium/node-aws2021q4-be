import { middyfy } from '@libs/lambda';
import { S3Handler } from 'aws-lambda';
import { bucketServices } from 'src/services/bucket';
import { stream } from 'src/services/stream';

import { PassThrough, pipeline } from 'stream';
import { promisify } from 'util';
const csv = require('csv-parser')

const pipelinePromise = promisify(pipeline);

const importProductsFile: S3Handler = async (event) => {
  const { Records } = event;
  try {
    await Promise.all(Records.map(async element => {
      const object = await bucketServices.getObject(element);
      try {
        await pipelinePromise(
          object.Body,
          new PassThrough({ encoding: 'utf8', objectMode: false }),
          csv({ mapHeaders: ({ header }) => header.toLowerCase() }),
          await stream.outputToQueue(),
        )
        console.log('Completed')
      } catch (err) {
        console.error('Failed ', err);
      }

    }));
  } catch (error) {
    console.log(error);
  }
}

export const main = middyfy(importProductsFile);
