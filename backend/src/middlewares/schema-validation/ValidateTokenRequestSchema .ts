export const ValidateTokenRequestSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
  },
  required: ['token'],
  additionalProperties: false,
};
