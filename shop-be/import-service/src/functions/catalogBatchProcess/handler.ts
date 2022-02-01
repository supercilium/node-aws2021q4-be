import { middyfy } from '@libs/lambda';
import { S3Handler } from 'aws-lambda';

const catalogBatchProcess: S3Handler = async (event) => {
}

export const main = middyfy(catalogBatchProcess);
