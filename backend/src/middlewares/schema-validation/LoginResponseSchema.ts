export const LoginResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
      },
      required: ['id', 'name'],
      additionalProperties: false,
    },
    team: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        currency: { type: 'string' },
      },
      required: ['id', 'currency'],
      additionalProperties: false,
    },
    board: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
  required: ['token', 'user', 'team'],
  additionalProperties: false,
};
