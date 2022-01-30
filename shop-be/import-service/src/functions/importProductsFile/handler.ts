import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { HTTP_CODES, HTTP_CODES_TYPE } from '../../../../constants';
import { bucketServices } from 'src/services/bucket';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const { queryStringParameters: { name } } = event;

  if (!name) {
    return {
      statusCode: HTTP_CODES.BUSINESS_ERROR,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: "No file name provided"
    }
  }

  let status: HTTP_CODES_TYPE = HTTP_CODES.SUCCESS;
  let signedUrl = '';

  try {
    signedUrl = await bucketServices.getSignedUrl(name);
  } catch (error) {
    console.log(error);
    status = HTTP_CODES.ERROR;
  }
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(signedUrl)
  }
}

export const main = middyfy(importProductsFile);
