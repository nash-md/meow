export const TeamResponseSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    currency: { type: 'string', minLength: 3, maxLength: 3 },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['_id', 'name', 'currency', 'createdAt', 'updatedAt'],
  additionalProperties: false,
};
