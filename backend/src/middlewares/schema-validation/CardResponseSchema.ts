export const CardResponseSchema = {
  type: 'object',
  properties: {
    teamId: { type: 'string' },
    user: { type: 'string' },
    laneId: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'number' },
    closedAt: { type: 'string' },
    attributes: { type: 'array' },
    updatedAt: { type: 'string' },
    createdAt: { type: 'string' },
    _id: { type: 'string' },
  },
  required: ['teamId', 'user', 'laneId', 'name', 'updatedAt', 'createdAt', '_id'],
  additionalProperties: false,
};
