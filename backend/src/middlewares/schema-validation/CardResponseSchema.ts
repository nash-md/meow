export const CardResponseSchema = {
  type: 'object',
  properties: {
    accountId: { type: 'string' },
    user: { type: 'string' },
    lane: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    closedAt: { type: 'string' },
    attributes: { type: 'array' },
    updatedAt: { type: 'string' },
    createdAt: { type: 'string' },
    id: { type: 'string' },
  },
  required: [
    'accountId',
    'user',
    'lane',
    'name',
    'updatedAt',
    'createdAt',
    'id',
  ],
  additionalProperties: false,
};
