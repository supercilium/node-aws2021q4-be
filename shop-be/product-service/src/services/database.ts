import { dbConnectAndExecute } from "@libs/db";
import { QueryResult } from "pg";
import { Product } from "src/types/product";

const getProductsQuery = 'select id, title, description, price, count from products p left join stocks s on p.id = s.product_id;'

export const productServices = {
    update: async ({ title, description, price, count }): Promise<QueryResult<Product>> => await dbConnectAndExecute<Product>({
        query: `with inserted_product as (
          insert into products
            (id, title, description, price) values 
            (uuid_generate_v4(), $1, $2, $3) returning id 
          )
         insert into stocks (product_id, count) values
          ((select id from inserted_product), $4);
      `,
        params: [title, description, price, count]
    }),
    find: async (): Promise<QueryResult<Product>> => await dbConnectAndExecute<Product>({ query: getProductsQuery }),
    findOne: async (id: string): Promise<QueryResult<Product>> => await dbConnectAndExecute<Product>({ query: 'select id, title, description, price, count from products p left join stocks s on p.id = s.product_id where id = $1;', params: [id] }),
}

