import test from 'ava';
import request from 'supertest';
import Ajv from 'ajv';
import { Helper, generateRandomString } from './helpers/helper.js';
import { UsersResponseSchema } from '../middlewares/schema-validation/UsersResponseSchema.js';
import { UserResponseSchema } from '../middlewares/schema-validation/UserResponseSchema.js';
import { UserStatus } from '../entities/User.js';
import { MINIMUM_LENGTH_OF_USER_PASSWORD } from '../Constants.js';

// @ts-ignore
const ajv = new Ajv();

const URL = process.env.URL!;

const context = { token: '', user: Helper.createRandomUser(), lanes: <any>[] };

test.serial(`/register with ${context.user.name} and password returns 201`, async (t) => {
  const res = await request(URL)
    .post('/public/register')
    .set('Content-Type', 'application/json')
    .send({
      name: context.user.name,
      password: context.user.password,
    });

  t.is(res.statusCode, 201);
});

test.serial(`/login ${context.user.name} with password returns 200`, async (t) => {
  const res = await request(URL)
    .post('/public/login')
    .set('Content-Type', 'application/json')
    .send({
      name: context.user.name,
      password: context.user.password,
    });

  context.token = res.body.token;
  context.user._id = res.body.user.id;
  context.user.teamId = res.body.team.id;

  t.is(res.statusCode, 200);
});

test.serial(`GET /users with valid token returns 200 and has a valid JSON schema`, async (t) => {
  const res = await request(URL)
    .get('/api/users')
    .set('Content-Type', 'application/json')
    .set('Token', context.token);

  const validate = ajv.compile(UsersResponseSchema);
  const isValid = validate(res.body);

  if (!isValid && validate.errors) {
    console.error('Validation errors:', validate.errors);
  }

  t.is(isValid, true);
  t.is(res.statusCode, 200);
  t.is(res.body.length, 1);
  t.is(res.type, 'application/json');
});

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

    if (!isValid && validate.errors) {
      console.error('Validation errors:', validate.errors);
    }

    t.is(isValid, true);
    t.is(res.body.status, UserStatus.Invited);
    t.is(res.type, 'application/json');
  }
);

test.serial(`GET /users returns an additional entry after user creation`, async (t) => {
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
});

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
      .post('/api/users/' + res.body._id)
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
  `POST /register accepts a registration with invite code, user is able to login and invite code is null`,
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

    const res4 = await request(URL)
      .post('/api/users/' + res3.body._id)
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    t.is(res4.body.invite, undefined);
    t.is(res3.type, 'application/json');
  }
);

test.serial(
  `POST /user/:id/password can update a local password, the existing password is rejected afterwards, the new password accepted`,
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

    const res4 = await request(URL)
      .post('/api/users/' + res3.body.user._id + '/password')
      .set('Content-Type', 'application/json')
      .set('Token', res3.body.token)
      .send({
        existing: localContext.password,
        updated: localContext.password + '_new',
      });

    t.is(res4.statusCode, 200);
    t.is(res4.type, 'application/json');

    const res5 = await request(URL)
      .post('/public/login')
      .set('Content-Type', 'application/json')
      .send({
        name: localContext.name,
        password: localContext.password,
      });

    t.is(res5.statusCode, 401);
    t.is(res5.type, 'application/json');

    const res6 = await request(URL)
      .post('/public/login')
      .set('Content-Type', 'application/json')
      .send({
        name: localContext.name,
        password: localContext.password + '_new',
      });

    t.is(res6.statusCode, 200);
    t.is(res6.type, 'application/json');
  }
);

test.serial(`POST /user/:id/password fails on a different user`, async (t) => {
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

  const res4 = await request(URL)
    .post('/api/users/' + res3.body.user._id + '/password')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      existing: localContext.password,
      updated: localContext.password + '_new',
    });

  t.is(res4.statusCode, 403);
  t.is(res4.type, 'application/json');
});

test.serial(`POST /user/:id/password fails to set a password that is too short`, async (t) => {
  const localContext = Helper.createRandomUser();

  const res4 = await request(URL)
    .post('/api/users/' + localContext._id + '/password')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      existing: localContext.password,
      updated: generateRandomString(MINIMUM_LENGTH_OF_USER_PASSWORD - 1),
    });

  t.is(res4.statusCode, 400);
  t.is(res4.type, 'application/json');
});

test.serial(`POST /user/:id prevent users from changing the invite code`, async (t) => {
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

  const res3 = await request(URL)
    .post('/api/users/' + res.body._id)
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      invite: 'my-secret',
    });

  t.is(res3.statusCode, 400);
  t.is(res3.type, 'application/json');
});

test.serial(
  `POST /user/:id settings can be updated and returned on the next GET request`,
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

    const res3 = await request(URL)
      .post('/api/users/' + res.body._id)
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        animal: 'zebra',
        color: '#432234',
      });

    t.is(res3.statusCode, 200);
    t.is(res3.type, 'application/json');
    t.is(res3.body.animal, 'zebra');
    t.is(res3.body.color, '#432234');
  }
);

test.serial(`POST /user/:id adding additional data to an update request is rejected`, async (t) => {
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

  const res3 = await request(URL)
    .post('/api/users/' + res.body._id)
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      fake: true,
    });

  t.is(res3.statusCode, 400);
});
