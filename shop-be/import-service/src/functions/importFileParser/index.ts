import { handlerPath } from '@libs/handlerResolver';
import { config } from '../../../config';

const { PREFIX, BUCKET_NAME } = config;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: PREFIX
        }],
        existing: true
      }
    }
  ]
}
