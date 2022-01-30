import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { HTTP_CODES } from 'src/constants';
import { productServices } from 'src/services/database';

import schema from './schema';

const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { body: { title, description, price, count } } = event;
  const res = await productServices.update({ title, description, price, count })

  if (!res) {
    return formatJSONResponse({
      body: 'Internal server error',
    }, HTTP_CODES.ERROR)
  }
  return formatJSONResponse(null, HTTP_CODES.CREATED);
}

export const main = middyfy(postProduct, schema)

