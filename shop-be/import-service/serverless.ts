import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

import { config } from './config';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
      BUCKET_NAME: config.BUCKET_NAME,
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: `arn:aws:s3:::${config.BUCKET_NAME}`
      },
      {
        Effect: 'Allow',
        Action: ['s3:GetObject', 's3:PutObject'],
        Resource: `arn:aws:s3:::${config.BUCKET_NAME}/*`
      },
    ]
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  resources: {
    Resources: {
      productsImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: config.BUCKET_NAME,
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [{
              AllowedOrigins: ['*'],
              AllowedHeaders: ['*'],
              AllowedMethods: ['POST', 'PUT', 'DELETE'],
            }]
          },
        }
      },
      productsImportBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: config.BUCKET_NAME,
          PolicyDocument: {
            Statement: {
              Effect: 'Allow',
              Principal: '*',
              Action: "s3:*",
              Resource: `arn:aws:s3:::${config.BUCKET_NAME}/*`
            }
          }
        }
      }
    }
  },
  custom: {
    s3BucketName: config.BUCKET_NAME,
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  outputs: {
    productsImportBucket: 'productsImportBucket'
  }
};

module.exports = serverlessConfiguration;
