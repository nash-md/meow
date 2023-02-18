export const LanesResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      accountId: { type: 'string' },
      name: { type: 'string' },
      index: { type: 'integer' },
      tags: {
        type: 'object',
        properties: {
          type: { type: 'string' },
        },
        additionalProperties: false,
      },
      inForecast: { type: 'boolean' },
      color: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      id: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: [
      'accountId',
      'name',
      'index',
      'tags',
      'inForecast',
      'id',
      'createdAt',
      'updatedAt',
    ],
    additionalProperties: false,
  },
};
