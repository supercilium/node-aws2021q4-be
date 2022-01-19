import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { dbConnectAndExecute } from '@libs/db';
import { middyfy } from '@libs/lambda';
import { Product } from 'src/types/product';

import schema from './schema';

const getProductsQuery = 'select id, title, description, price, count from products p left join stocks s on p.id = s.product_id;'

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (_event) => {
  const { rows: products } = await dbConnectAndExecute<Product>({ query: getProductsQuery })

  return formatJSONResponse({
    products,
  });
}

export const main = middyfy(getProducts);
