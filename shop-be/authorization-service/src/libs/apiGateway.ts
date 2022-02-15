import type { APIGatewayAuthorizerResult } from "aws-lambda"

export const generatePolicy = (principalId: string, resource: string, effect: 'Allow' | 'Deny'): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  }
})