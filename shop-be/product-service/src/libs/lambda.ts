import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import validator from '@middy/validator'

// const logger = {
//   before: request => console.log(request),
//   after: request => console.log(request)
// }

export const middyfy = (handler, inputSchema = {}) => {
  // return middy(handler).use(logger).use(middyJsonBodyParser()).use(validator({ inputSchema }))
  return middy(handler).use(middyJsonBodyParser()).use(validator({ inputSchema }))
}
