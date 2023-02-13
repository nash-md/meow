export const CardRequestSchema = {
  type: 'object',
  required: ['lane', 'name'],
  properties: {
    lane: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    user: { type: 'string' },
    closedAt: { type: ['string', 'null'] },
  },
  additionalProperties: false,
};
