import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          arn: 'arn:aws:lambda:eu-west-1:104990440280:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
        }
      }
    }
  ]
}
