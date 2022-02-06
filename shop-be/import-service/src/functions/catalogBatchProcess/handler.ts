import { middyfy } from '@libs/lambda';
import { SQSHandler } from 'aws-lambda';
import { productServices } from 'src/services/db';
import { snsServices } from 'src/services/sns';

const catalogBatchProcess: SQSHandler = async (event) => {
  const { Records } = event;
  try {
    await Promise.all(Records.map(async element => {
      const data = JSON.parse(element.body);
      await productServices.insert(data);
      await snsServices.send(`Added record ${data.title}`)
    }));
  } catch (error) {
    console.log(error);
  }
}

export const main = middyfy(catalogBatchProcess);
