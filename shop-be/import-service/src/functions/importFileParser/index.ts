import { PREFIX } from '@libs/constants';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'marusel-bucket-aws',
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: PREFIX
        }],
        existing: true
      }
    }
  ]
}
