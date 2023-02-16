export const SchemaRequestSchema = {
  type: 'object',
  required: ['type', 'schema'],
  properties: {
    type: { type: 'string' },
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          index: { type: 'number' },
          name: { type: 'string' },
          type: {
            type: 'string',
            enum: ['text', 'textarea', 'select'],
          },
          options: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['key', 'index', 'name', 'type'],
      },
    },
  },
  additionalProperties: false,
};
