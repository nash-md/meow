export const LoginRequestSchema = {
  type: 'object',
  oneOf: [
    {
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 500 },
        password: { type: 'string', minLength: 3, maxLength: 500 },
      },
      required: ['name', 'password'],
    },
    {
      properties: {
        token: { type: 'string', minLength: 1 },
      },
      required: ['token'],
    },
  ],
};
