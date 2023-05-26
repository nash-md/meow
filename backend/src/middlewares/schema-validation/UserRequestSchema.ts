export const UserRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 500 },
    animal: {
      type: 'string',
      maxLength: 500,
    },
    color: {
      type: 'string',
      maxLength: 7,
      minLength: 7,
    },
  },
  required: ['name'],

  additionalProperties: false,
};
