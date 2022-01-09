import { dbConnectAndExecute } from '@libs/db';

const createProductsTable = `
    create table if not exists products (
        id uuid primary key,
        title text,
        description text,
        price integer
    );
`
const createStocksTable = `
    create table if not exists stocks (
        product_id uuid references products(id),
        count integer
    );
`
const fillProductsTable = `
    insert into products (id, title, description, price) values 
        ('00284a51-43ba-4606-9e0e-1b83aff358a4', 'tsatska takaya', 'takaya klassnaya tsatska', '100500'),
        ('48f8abf8-ea87-4e49-8382-aa5bc39e6373', 'tsatska na sheuy', 'ochen krutaya, mamoj klyanus', '1000000'),
        ('a67e1c0b-46c8-4f6f-bae0-86f313a90a3b', 'ring of omnipotence', 'one ring to rule them all', '8');
`
const fillStocksTable = `
    insert into stocks (product_id, count) values 
        ('00284a51-43ba-4606-9e0e-1b83aff358a4', 5),
        ('48f8abf8-ea87-4e49-8382-aa5bc39e6373', 10),
        ('a67e1c0b-46c8-4f6f-bae0-86f313a90a3b', 1);
`

export const main = async (_event) => {
    console.log('Database initialization started')
    await dbConnectAndExecute([createProductsTable, createStocksTable, fillProductsTable, fillStocksTable])
    console.log('Database initialization finished')
}
