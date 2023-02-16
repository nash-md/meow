export const CardRequestSchema = {
  type: 'object',
  required: ['lane', 'name'],
  properties: {
    lane: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    attributes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keyId: { type: 'string' },
          value: { type: 'string' },
        },
        required: ['keyId', 'value'],
      },
    },
    user: { type: 'string' },
    closedAt: { type: ['string', 'null'] },
  },
  additionalProperties: false,
};
