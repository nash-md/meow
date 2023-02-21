export const UserUpdateRequestSchema = {
  type: 'object',
  properties: {
    animal: { type: 'string', maxLength: 500 },
    status: { type: 'string', maxLength: 50 },
  },
  additionalProperties: false,
};
