export const LoginResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        _id: {
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
        authentication: {
          type: 'string',
        },
        lastLoginAt: {
          type: ['string', 'null'],
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
      required: ['_id', 'teamId', 'name', 'status'],
      additionalProperties: false,
    },
    team: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        currency: { type: 'string' },
        integrations: {
          type: 'array',
        },
      },
      required: ['_id', 'currency'],
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
