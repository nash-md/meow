export const CardRequestSchema = {
  type: 'object',
  required: ['name'],
  oneOf: [
    {
      properties: {
        laneId: { type: 'string' },
      },
      required: ['laneId'],
    },
    {
      properties: {
        laneName: { type: 'string' },
      },
      required: ['laneName'],
    },
  ],
  properties: {
    laneId: { type: 'string' },
    laneName: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    attributes: {
      type: 'object',
      additionalProperties: {
        type: ['string', 'number', 'null'],
      },
    },
    userId: { type: 'string' },
    closedAt: { type: ['string', 'null'] },
    nextFollowUpAt: { type: ['string', 'null'] },
  },
};
