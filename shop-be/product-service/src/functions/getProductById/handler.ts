import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productsList from '../../resources/productList.json';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { pathParameters: { id } } = event;
  const product = productsList.find(item => item.id === id);
  if (!product) {
    return formatJSONResponse({
      body: 'Not found',
    }, 404)
  }
  return formatJSONResponse({
    product,
  });
}

export const main = middyfy(getProductById);
