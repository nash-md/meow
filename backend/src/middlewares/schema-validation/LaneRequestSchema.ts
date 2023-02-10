export const LaneRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 500 },
    inForecast: { type: 'boolean' },
    index: { type: 'number' },
    color: {
      type: ['string', 'null'],
    },
  },
  required: ['name', 'inForecast', 'index'],
  additionalProperties: false,
};
