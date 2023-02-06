export const RegisterRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 500 },
    password: { type: 'string', minLength: 1, maxLength: 500 },
  },
  required: ['name', 'password'],

  additionalProperties: false,
};
