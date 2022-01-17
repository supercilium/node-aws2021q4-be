import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { PutObjectCommand, PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PREFIX, REGION } from '@libs/constants';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const { queryStringParameters: { name } } = event;

  if (!name) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: "No file name provided"
    }
  }

  const s3 = new S3({ region: REGION });
  let status = 200;
  let signedUrl = '';

  const commandParams: PutObjectCommandInput = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${PREFIX}/${name}`,
    ContentType: 'text/csv'
  }

  const command = new PutObjectCommand(commandParams);

  try {
    signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  } catch (error) {
    console.log(error);
    status = 500;
  }
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(signedUrl)
  }
}

export const main = middyfy(importProductsFile);
