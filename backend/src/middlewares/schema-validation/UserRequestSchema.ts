export const UserRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 500 },
  },
  required: ['name'],

  additionalProperties: false,
};
