export default {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        title: {
          type: "string",
          minLength: 1,
          maxLength: 128
        },
        description: {
          type: "string",
          minLength: 1,
          maxLength: 256
        },
        price: {
          type: "number",
          minimum: 0
        },
        count: {
          type: "number",
          minimum: 0
        },
      },
      required: ['title', 'description', 'price', 'count']
    }
  }
} as const;
