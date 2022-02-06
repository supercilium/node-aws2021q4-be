import { Client, ClientConfig } from 'pg';
import { config } from '../../config';
interface DbQuery {
    query: string;
    params?: unknown[]
}

const { POSTGRESQL_CONNECTION_STRING } = config;

const dbOptions: ClientConfig = {
    connectionString: POSTGRESQL_CONNECTION_STRING,
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