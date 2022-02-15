import { generatePolicy } from '@libs/apiGateway';
import { APIGatewayAuthorizerHandler, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

import { config } from '../../../config'

const tokenAuthorizer: APIGatewayAuthorizerHandler = async (event, ctx, callback) => {
  console.log("Event ", JSON.stringify(event))

  if (event.type !== 'TOKEN') {
    callback('Unauthorized');
  }

  try {
    const token = (event as APIGatewayTokenAuthorizerEvent).authorizationToken;

    const encodedCreds = token.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const [username, password] = plainCreds;

    const storedPassword = config[username];
    const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    callback(null, policy)
    return policy;
  } catch (error) {
    callback('Forbidden', error)
  }
}

export const main = tokenAuthorizer;
