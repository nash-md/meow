export const UsersResponseSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'array',
  items: {
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
    required: ['teamId', 'name', 'status'],
  },
};
