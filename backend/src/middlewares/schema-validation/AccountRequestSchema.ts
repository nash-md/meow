export const AccountRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 500 },
    attributes: {
      type: 'object',
      additionalProperties: {
        type: ['string', 'number', 'null', 'boolean'],
      },
    },
  },
  required: ['name'],
  additionalProperties: false,
};
