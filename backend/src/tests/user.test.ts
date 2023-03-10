import test from 'ava';
import request from 'supertest';
import Ajv from 'ajv';
import { Helper } from './helpers/helper.js';
import { UsersResponseSchema } from '../middlewares/schema-validation/UsersResponseSchema.js';
import { UserResponseSchema } from '../middlewares/schema-validation/UserResponseSchema.js';
import { UserStatus } from '../entities/User.js';

// @ts-ignore
const ajv = new Ajv();

const URL = process.env.URL!;

const context = { token: '', user: Helper.createRandomUser(), lanes: <any>[] };

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
  `GET /users with valid token returns 200 and has a valid JSON schema`,
  async (t) => {
    const res = await request(URL)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    const validate = ajv.compile(UsersResponseSchema);
    const isValid = validate(res.body);

    t.is(isValid, true);
    t.is(res.statusCode, 200);
    t.is(res.body.length, 1);
    t.is(res.type, 'application/json');
  }
);

test.serial(`POST /users with the same name returns 409`, async (t) => {
  const res = await request(URL)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      name: context.user.name,
    });

  t.is(res.statusCode, 409);
  t.is(res.type, 'application/json');
});

test.serial(`POST /users with an invalid JSON body returns 400`, async (t) => {
  const res = await request(URL)
    .post('/api/users')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      name: context.user.name,
      fake: true,
    });

  t.is(res.statusCode, 400);
  t.is(res.type, 'application/json');
});

test.serial(
  `POST /users with an valid JSON body returns 200 and a valid JSON body with UserStatus.Invited`,
  async (t) => {
    const res = await request(URL)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: Helper.createRandomUser().name,
      });

    const validate = ajv.compile(UserResponseSchema);
    const isValid = validate(res.body);

    t.is(isValid, true);
    t.is(res.body.status, UserStatus.Invited);
    t.is(res.type, 'application/json');
  }
);

test.serial(
  `GET /users returns an additional entry after user creation`,
  async (t) => {
    const res = await request(URL)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    const count = res.body.length;

    await request(URL)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: Helper.createRandomUser().name,
      });

    const res2 = await request(URL)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    t.is(res2.body.length, count + 1);
  }
);

test.serial(
  `GET /users returns same number of users after deletion but status is UserStatus.Deleted`,
  async (t) => {
    const res = await request(URL)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: Helper.createRandomUser().name,
      });

    const res2 = await request(URL)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    const count = res2.body.length;

    const res3 = await request(URL)
      .post('/api/users/' + res.body.id)
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        status: UserStatus.Deleted,
      });

    t.is(res3.body.status, UserStatus.Deleted);
    t.is(res3.type, 'application/json');

    const res4 = await request(URL)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    t.is(res4.body.length, count);
  }
);

test.serial(
  `POST /users returns an invite code, the user's name is returned via GET /register/invite`,
  async (t) => {
    const res = await request(URL)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: Helper.createRandomUser().name,
      });

    t.is(res.body.status, UserStatus.Invited);
    t.is(res.body.invite.length, 8);
    t.is(res.type, 'application/json');

    const res2 = await request(URL)
      .get(`/public/register/invite?invite=${res.body.invite}`)
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    t.is(res2.body.name, res.body.name);
    t.is(res2.type, 'application/json');
  }
);

test.serial(
  `POST /register accepts a registration with invite code, user is able to login`,
  async (t) => {
    const localContext = Helper.createRandomUser();

    const res = await request(URL)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        name: localContext.name,
      });

    t.is(res.body.status, UserStatus.Invited);
    t.is(res.body.invite.length, 8);
    t.is(res.type, 'application/json');

    const res2 = await request(URL)
      .post('/public/register')
      .set('Content-Type', 'application/json')
      .send({
        name: localContext.name,
        invite: res.body.invite,
        password: localContext.password,
      });

    t.is(res2.statusCode, 200);
    t.is(res2.type, 'application/json');

    const res3 = await request(URL)
      .post('/public/login')
      .set('Content-Type', 'application/json')
      .send({
        name: localContext.name,
        password: localContext.password,
      });

    t.is(res3.statusCode, 200);
    t.is(res3.type, 'application/json');
  }
);
