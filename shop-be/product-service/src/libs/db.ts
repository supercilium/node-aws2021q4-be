import { Client, ClientConfig } from 'pg';

interface DbQuery {
    query: string;
    params?: unknown[]
}

const { POSTGRESQL_HOST, POSTGRESQL_PORT, DB_NAME, USERNAME, PASSWORD } = process.env;

const dbOptions: ClientConfig = {
    host: POSTGRESQL_HOST,
    port: +POSTGRESQL_PORT,
    database: DB_NAME,
    user: USERNAME,
    password: PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
}

export const dbExecute = async <T>(db: Client, dbQuery: DbQuery | DbQuery[]) => {
    try {
        if (Array.isArray(dbQuery)) {
            dbQuery.map(async queryObj => await db.query<T>(queryObj.query, queryObj.params))
        } else {
            return await db.query<T>(dbQuery.query, dbQuery.params)
        }
    } catch (error) {
        console.error('Error during database request executing:', error)
    } finally {
        db.end();
    }
};

export const dbConnectAndExecute = async <T>(query: DbQuery | DbQuery[]) => {
    const client = new Client(dbOptions);
    await client.connect();

    return dbExecute<T>(client, query);
}