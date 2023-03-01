export const AccountsResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      teamId: { type: 'string' },
      id: { type: 'string' },
      name: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['teamId', 'id', 'name', 'createdAt', 'updatedAt'],
    additionalProperties: false,
  },
};
