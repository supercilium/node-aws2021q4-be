import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { dbConnectAndExecute } from '@libs/db';
import { middyfy } from '@libs/lambda';
import { Product } from 'src/types/product';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { pathParameters: { id } } = event;
  const { rows: product } = await dbConnectAndExecute<Product>(`select id, title, description, price, count from products p left join stocks s on p.id = s.product_id where id = '${id}';`)

  if (!product) {
    return formatJSONResponse({
      body: 'Not found',
    }, 404)
  }
  return formatJSONResponse({ ...product[0] });
}

export const main = middyfy(getProductById, schema);
