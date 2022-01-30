export default {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 36,
          maxLength: 36
        },
      },
      required: ['id']
    }
  }
} as const;
