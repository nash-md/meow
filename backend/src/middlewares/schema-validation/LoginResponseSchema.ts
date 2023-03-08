export const LoginResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        teamId: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        animal: {
          type: 'string',
        },
        invite: {
          type: ['string', 'null'],
        },
        status: {
          type: 'string',
          enum: ['invited', 'enabled', 'disabled', 'deleted', 'single-sign-on'],
        },
        board: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        createdAt: {
          type: 'string',
        },
        updatedAt: {
          type: 'string',
        },
      },
      required: ['id', 'teamId', 'name', 'status'],
      additionalProperties: false,
    },
    team: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        currency: { type: 'string' },
      },
      required: ['id', 'currency'],
      additionalProperties: false,
    },
    board: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
  required: ['token', 'user', 'team'],
  additionalProperties: false,
};
