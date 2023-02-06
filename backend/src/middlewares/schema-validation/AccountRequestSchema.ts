export const AccountRequestSchema = {
  type: 'object',
  properties: {
    currency: { type: 'string', minLength: 3, maxLength: 3 },
  },
  required: ['currency'],
  additionalProperties: false,
};
