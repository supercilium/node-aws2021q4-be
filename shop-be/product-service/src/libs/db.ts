import { Client, ClientConfig } from 'pg';

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

export const dbExecute = async <T>(db: Client, query: string | string[]) => {
    try {
        if (Array.isArray(query)) {
            query.map(async queryString => await db.query<T>(queryString))
        } else {
            return await db.query<T>(query)
        }
    } catch (error) {
        console.error('Error during database request executing:', error)
    } finally {
        db.end();
    }
};

export const dbConnectAndExecute = async <T>(query: string | string[]) => {
    const client = new Client(dbOptions);
    await client.connect();

    return dbExecute<T>(client, query);
}