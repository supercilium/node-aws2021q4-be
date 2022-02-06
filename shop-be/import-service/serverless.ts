import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import catalogBatchProcess from '@functions/catalogBatchProcess';

import { config } from './config';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-s3-local', 'serverless-offline'],
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
      POSTGRESQL_CONNECTION_STRING: config.POSTGRESQL_CONNECTION_STRING,
      BUCKET_NAME: config.BUCKET_NAME,
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL: {
        Ref: 'catalogItemsQueue'
      },
      SNS_ARN: {
        Ref: 'productsImportSNSPublic'
      }
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
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: [{ 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] }]
      },
      {
        Effect: 'Allow',
        Action: ['sns:Publish'],
        Resource: 'arn:aws:sns:eu-west-1:104990440280:import-products-topic'
      }
    ]
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser, catalogBatchProcess },
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
      },
      productsImportSNSPublic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: config.SNS_NAME
        }
      },
      productsImportSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'marusel.12@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'productsImportSNSPublic'
          }
        }
      },
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: config.SQS_NAME
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
      external: ['pg-native']
    },
    s3: {
      port: 8000,
      directory: "./s3-local"
    }
  },
  outputs: {
    productsImportBucket: 'productsImportBucket'
  }
};

module.exports = serverlessConfiguration;
