import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import { HTTP_CODES } from "../../../constants"

export type ValidatedEventAPIGatewayProxyEvent = Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: HTTP_CODES.SUCCESS,
    body: JSON.stringify(response)
  }
}
