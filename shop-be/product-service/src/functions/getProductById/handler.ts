import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { HTTP_CODES } from '../../../../constants';
import { productServices } from 'src/services/database';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { pathParameters: { id } } = event;
  const { rows: product } = await productServices.findOne(id);

  if (!product) {
    return formatJSONResponse({
      body: 'Not found',
    }, HTTP_CODES.NOT_FOUND)
  }
  return formatJSONResponse({ ...product[0] });
}

export const main = middyfy(getProductById, schema);
