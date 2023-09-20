export const UserResponseSchema = {
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
    authentication: {
      type: ['string'],
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
  required: ['_id', 'teamId', 'name', 'status', 'authentication'],

  additionalProperties: false,
};
