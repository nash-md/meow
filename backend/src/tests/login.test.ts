import test from 'ava';
import request from 'supertest';
import Ajv from 'ajv';
import { RegisterResponseSchema } from '../middlewares/schema-validation/RegisterResponseSchema.js';
import { LoginResponseSchema } from '../middlewares/schema-validation/LoginResponseSchema.js';
import jsonwebtoken from 'jsonwebtoken';
import { Helper } from './helpers/helper.js';
import { UserStatus } from '../entities/User.js';
const { sign } = jsonwebtoken;

// @ts-ignore
const ajv = new Ajv();

const URL = process.env.URL!;

const createJwt = (userId: string, teamId: string, ttl: number): string => {
  const payload = {
    iat: Date.now(),
    exp: Math.floor(Date.now() / 1000) + ttl,
    userId: userId,
    teamId: teamId,
  };

  return sign(payload, 'my-secret');
};

const context = { token: '', user: Helper.createRandomUser() };

test.serial(
  `/register with ${context.user.name} and password returns 200 and has a valid JSON schema`,
  async (t) => {
    const res = await request(URL)
      .post('/public/register')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
        password: context.user.password,
      });

    const validate = ajv.compile(RegisterResponseSchema);
    const isValid = validate(res.body);

    t.is(isValid, true);
    t.is(res.statusCode, 200);
    t.is(res.type, 'application/json');
  }
);

test.serial(
  `/login ${context.user.name} without password returns 400`,
  async (t) => {
    const res = await request(URL)
      .post('/public/login')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
      });

    t.is(res.statusCode, 400);
    t.is(res.type, 'application/json');
  }
);

test.serial(
  `/login ${context.user.name} with password returns 200 and has a valid JSON schema`,
  async (t) => {
    const res = await request(URL)
      .post('/public/login')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
        password: context.user.password,
      });

    const validate = ajv.compile(LoginResponseSchema);
    const isValid = validate(res.body);

    context.token = res.body.token;
    context.user.id = res.body.user.id;
    context.user.teamId = res.body.team.id;

    t.is(isValid, true);
    t.is(res.statusCode, 200);
    t.is(res.body.user.status, UserStatus.Enabled);
    t.is(res.type, 'application/json');
  }
);

test.serial(`/cards with valid token returns 200`, async (t) => {
  const res = await request(URL)
    .get('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', context.token);

  t.is(res.statusCode, 200);
  t.is(Array.isArray(res.body), true);
  t.is(res.type, 'application/json');
});

test.serial(`/cards without token returns 401`, async (t) => {
  const res = await request(URL)
    .get('/api/cards')
    .set('Content-Type', 'application/json');

  t.is(res.statusCode, 401);
});

test.serial(`/cards with invalid JWT token returns 401`, async (t) => {
  const res = await request(URL)
    .get('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', 'my-invalid-token');

  t.is(res.statusCode, 401);
});

test.serial(`/cards with an invalid signed JWT returns 401`, async (t) => {
  const token = createJwt(context.user.id, context.user.teamId, 86400);
  const res = await request(URL)
    .get('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', token);

  t.is(res.statusCode, 401);
  t.is(res.body.name, 'invalid_token');
});
