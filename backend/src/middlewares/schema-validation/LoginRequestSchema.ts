export const LoginRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 500 },
    password: { type: 'string', minLength: 3, maxLength: 500 },
  },
  required: ['name', 'password'],

  additionalProperties: false,
};
