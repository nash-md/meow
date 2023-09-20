export const LanesRequestSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'array',
  items: {
    type: 'object',
    required: ['name', 'index', 'inForecast'],
    additionalProperties: false,
    properties: {
      _id: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      index: {
        type: 'number',
      },
      inForecast: {
        type: 'boolean',
      },
      color: {
        type: ['string', 'null'],
      },
      tags: {
        type: ['object'],
      },
    },
  },
};
