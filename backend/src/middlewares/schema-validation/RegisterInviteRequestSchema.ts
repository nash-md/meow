export const RegisterInviteRequestSchema = {
  type: 'object',
  properties: {
    invite: { type: 'string', minLength: 8, maxLength: 8 },
  },
  required: ['invite'],

  additionalProperties: false,
};
