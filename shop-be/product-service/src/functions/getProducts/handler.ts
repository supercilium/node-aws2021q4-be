import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productsList from '../../resources/productList.json';

import schema from './schema';

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {
  return formatJSONResponse({
    products: productsList,
  });
}

export const main = middyfy(getProducts);
