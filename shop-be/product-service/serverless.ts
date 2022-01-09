import type { AWS } from '@serverless/typescript';
require('dotenv').config()

import getProducts from '@functions/getProducts';
import getProductById from '@functions/getProductById';
import dbInit from '@functions/dbInit';
import postProduct from '@functions/postProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      POSTGRESQL_HOST: process.env.POSTGRESQL_HOST,
      POSTGRESQL_PORT: '5432',
      DB_NAME: 'postgres',
      USERNAME: process.env.USERNAME,
      PASSWORD: process.env.PASSWORD
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProducts, getProductById, dbInit, postProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external: ['pg-native']
    },
  },
};

module.exports = serverlessConfiguration;
