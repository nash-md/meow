export const CardRequestSchema = {
  type: 'object',
  required: ['lane', 'name'],
  properties: {
    lane: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    attributes: {
      type: 'object',
      additionalProperties: {
        type: ['string', 'number', 'null'],
      },
    },
    user: { type: 'string' },
    closedAt: { type: ['string', 'null'] },
  },
};
