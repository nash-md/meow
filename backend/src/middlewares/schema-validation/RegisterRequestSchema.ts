export const RegisterRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 50 },
    password: { type: 'string', minLength: 3, maxLength: 50 },
  },
  required: ['name', 'password'],

  additionalProperties: false,
};
