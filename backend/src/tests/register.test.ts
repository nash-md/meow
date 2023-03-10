import test from 'ava';
import request from 'supertest';
import Ajv from 'ajv';
import { RegisterResponseSchema } from '../middlewares/schema-validation/RegisterResponseSchema.js';
import { Helper } from './helpers/helper.js';

// @ts-ignore
const ajv = new Ajv();

const URL = process.env.URL!;

const context = { token: '', user: Helper.createRandomUser() };

test.serial('/register with text/plain returns 415', async (t) => {
  const res = await request(URL)
    .post('/public/register')
    .set('Content-Type', 'text/plain');

  t.is(res.statusCode, 415);
  t.is(res.type, 'application/json');
});

test.serial('/register without a JSON body returns 400', async (t) => {
  const res = await request(URL)
    .post('/public/register')
    .set('Content-Type', 'application/json');

  t.is(res.statusCode, 400);
  t.is(res.type, 'application/json');
});

test.serial(
  `/register ${context.user.name} without a password returns 400`,
  async (t) => {
    const res = await request(URL)
      .post('/public/register')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
      });

    t.is(res.statusCode, 400);
    t.is(res.type, 'application/json');
  }
);

test.serial(
  `/register  ${context.user.name} with a short password returns 400`,
  async (t) => {
    const res = await request(URL)
      .post('/public/register')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
        password: 'ok',
      });

    t.is(res.statusCode, 400);
    t.is(res.type, 'application/json');
  }
);

test.serial(
  `/register ${context.user.name} with an additional property returns 400`,
  async (t) => {
    const res = await request(URL)
      .post('/public/register')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
        fake: true,
      });

    t.is(res.statusCode, 400);
    t.is(res.type, 'application/json');
  }
);

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
  `/register with ${context.user.name} name returns 409 - conflict`,
  async (t) => {
    const res = await request(URL)
      .post('/public/register')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
        password: context.user.password,
      });

    t.is(res.statusCode, 409);
    t.is(res.type, 'application/json');
  }
);

test.serial(`/register/invite with an invalid invite code 404`, async (t) => {
  const res = await request(URL)
    .get(`/public/register/invite?invite=8-digits`)
    .set('Content-Type', 'application/json')
    .set('Token', context.token);

  t.is(res.statusCode, 404);
  t.is(res.type, 'application/json');
});
