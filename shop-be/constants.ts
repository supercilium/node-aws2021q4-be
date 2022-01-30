export const HTTP_CODES = {
    NOT_FOUND: 404,
    SUCCESS: 200,
    ERROR: 500,
    CREATED: 201,
    BUSINESS_ERROR: 400,
} as const;

export type HTTP_CODES_TYPE = typeof HTTP_CODES[keyof typeof HTTP_CODES];