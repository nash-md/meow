export const AccountRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 500 },
    address: { type: 'string', maxLength: 500 },
    phone: { type: 'string', maxLength: 500 },
  },
  required: ['name'],
  additionalProperties: false,
};
