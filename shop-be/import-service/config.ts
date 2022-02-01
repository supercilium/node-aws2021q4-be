export const config = {
    BUCKET_NAME: 'marusel-bucket-aws',
    REGION: 'eu-west-1',
    PREFIX: 'uploaded',
    EXPIRES_IN: 60,
    BATCH_SIZE: 5,
    SQS_URL: process.env.SQS_URL,
    SQS_NAME: 'import-products-queue',
    POSTGRESQL_CONNECTION_STRING: process.env.POSTGRESQL_CONNECTION_STRING
}