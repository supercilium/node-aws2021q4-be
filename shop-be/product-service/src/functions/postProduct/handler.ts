import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { dbConnectAndExecute } from '@libs/db';
import { middyfy } from '@libs/lambda';
import { Product } from 'src/types/product';

import schema from './schema';

const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { body: { title, description, price, count } } = event;
  const res = await dbConnectAndExecute<Product>({
    query: `with inserted_product as (
      insert into products
        (id, title, description, price) values 
        (uuid_generate_v4(), $1, $2, $3) returning id 
      )
     insert into stocks (product_id, count) values
      ((select id from inserted_product), $4);
  `,
    params: [title, description, price, count]
  })

  if (!res) {
    return formatJSONResponse({
      body: 'Internal server error',
    }, 500)
  }
  return formatJSONResponse(null, 201);
}

export const main = middyfy(postProduct, schema)

