export const UserUpdateRequestSchema = {
  type: 'object',
  properties: {
    animal: { type: 'string', maxLength: 500 },
  },
  required: ['animal'],

  additionalProperties: false,
};
