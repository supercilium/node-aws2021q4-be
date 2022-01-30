import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { productServices } from 'src/services/database';

import schema from './schema';

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {
  const { rows: products } = await productServices.find();

  return formatJSONResponse({
    products,
  });
}

export const main = middyfy(getProducts);
