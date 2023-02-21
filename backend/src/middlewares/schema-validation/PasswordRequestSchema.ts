export const PasswordRequestSchema = {
  type: 'object',
  properties: {
    existing: { type: 'string', minLength: 3, maxLength: 500 },
    updated: { type: 'string', minLength: 3, maxLength: 500 },
  },
  required: ['existing', 'updated'],

  additionalProperties: false,
};
