export const RegisterResponseSchema = {
  type: 'object',
  properties: {
    welcome: {
      type: 'boolean',
      const: true,
    },
  },
  required: ['welcome'],
  additionalProperties: false,
};
