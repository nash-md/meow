import test from 'ava';
import request from 'supertest';
import Ajv from 'ajv';
import { Helper } from './helpers/helper.js';
import { AccountsResponseSchema } from '../middlewares/schema-validation/AccountsResponseSchema.js';

// @ts-ignore
const ajv = new Ajv();

const URL = process.env.URL!;

const context = {
  token: '',
  user: Helper.createRandomUser(),
  accounts: <any>[],
};

test.serial(
  `/register with ${context.user.name} and password returns 200`,
  async (t) => {
    const res = await request(URL)
      .post('/public/register')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
        password: context.user.password,
      });

    t.is(res.statusCode, 200);
  }
);

test.serial(
  `/login ${context.user.name} with password returns 200`,
  async (t) => {
    const res = await request(URL)
      .post('/public/login')
      .set('Content-Type', 'application/json')
      .send({
        name: context.user.name,
        password: context.user.password,
      });

    context.token = res.body.token;
    context.user.id = res.body.user.id;
    context.user.teamId = res.body.team.id;

    t.is(res.statusCode, 200);
  }
);

test.serial(
  `/accounts with valid token returns 200 and has a valid JSON schema`,
  async (t) => {
    const res = await request(URL)
      .get('/api/accounts')
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    const validate = ajv.compile(AccountsResponseSchema);
    const isValid = validate(res.body);

    context.accounts = res.body;

    t.is(isValid, true);
    t.is(res.statusCode, 200);
    t.is(res.type, 'application/json');
  }
);

test.serial(`/accounts without a JSON body returns 400`, async (t) => {
  const res = await request(URL)
    .post('/api/accounts')
    .set('Content-Type', 'application/json')
    .set('Token', context.token);

  t.is(res.statusCode, 400);
  t.is(res.type, 'application/json');
});

test.serial(`/accounts with an invalid JSON body returns 400`, async (t) => {
  const res = await request(URL)
    .post('/api/accounts')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      name: 'my-first-account',
      fake: true,
    });

  t.is(res.statusCode, 400);
  t.is(res.type, 'application/json');
});

test.serial(
  `/accounts with a valid body returns 200 and has a valid JSON schema`,
  async (t) => {
    const res = await request(URL)
      .post('/api/accounts')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: 'My First Account',
        address: 'My First Street',
        phone: 'secret',
      });

    t.is(res.statusCode, 200);
    t.is(res.body.name, 'My First Account');
    t.is(res.body.address, 'My First Street');
    t.is(res.body.phone, 'secret');
    t.is(res.type, 'application/json');
  }
);

test.serial(
  `/accounts create successful and values can be updated`,
  async (t) => {
    const res = await request(URL)
      .post('/api/accounts')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: 'My Second Account',
        address: 'My Second Street',
        phone: 'secret',
      });

    t.is(res.body.name, 'My Second Account');
    t.is(res.body.address, 'My Second Street');
    t.is(res.body.phone, 'secret');

    const updated = await request(URL)
      .post(`/api/accounts/${res.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: 'My Second Account Updated',
        address: 'My Second Street Updated',
        phone: 'new-secret',
      });

    t.is(updated.body.name, 'My Second Account Updated');
    t.is(updated.body.address, 'My Second Street Updated');
    t.is(updated.body.phone, 'new-secret');
    t.is(updated.type, 'application/json');
  }
);

test.serial(
  `/accounts update a account from another account returns 404`,
  async (t) => {
    const res2 = await request(URL)
      .post('/api/accounts')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: 'My First Account',
        address: 'My First Street',
        phone: 'secret',
      });

    const contextB = await Helper.createRandomUserWithToken(URL);

    const updated = await request(URL)
      .post(`/api/accounts/${res2.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', contextB.token)
      .send({
        name: 'My First Account',
        address: 'My First Street',
        phone: 'secret',
      });

    t.is(updated.statusCode, 404);
  }
);
