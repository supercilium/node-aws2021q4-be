import { handlerPath } from '@libs/handlerResolver';
import { config } from '../../../config';

const { BATCH_SIZE } = config;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: BATCH_SIZE,
        arn: {
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
        },
      }
    }
  ]
}
