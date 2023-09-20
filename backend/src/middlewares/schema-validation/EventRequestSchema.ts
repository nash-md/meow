export const EventRequestSchema = {
  type: 'object',
  properties: {
    text: { type: 'string', minLength: 1, maxLength: 500 },
    type: { type: 'string', minLength: 1, maxLength: 50 },
    accountId: { type: 'string', minLength: 1, maxLength: 50 },
    cardId: { type: 'string', minLength: 1, maxLength: 50 },
  },
  required: ['text'],

  additionalProperties: false,
};
