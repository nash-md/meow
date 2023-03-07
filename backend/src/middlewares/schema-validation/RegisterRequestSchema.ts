export const RegisterRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 50 },
    password: { type: 'string', minLength: 3, maxLength: 50 },
    invite: { type: 'string', minLength: 8, maxLength: 8 },
  },
  required: ['name', 'password'],

  additionalProperties: false,
};
