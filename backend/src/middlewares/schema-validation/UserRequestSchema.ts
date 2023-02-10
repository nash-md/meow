export const UserRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 500 },
    password: { type: 'string', maxLength: 500 },
  },
  required: ['name', 'password'],

  additionalProperties: false,
};
