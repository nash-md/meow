export const LaneRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    inForecast: { type: 'boolean' },
  },
  required: ['name', 'inForecast'],
  additionalProperties: false,
};
