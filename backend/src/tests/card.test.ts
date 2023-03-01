import test from 'ava';
import request from 'supertest';
import Ajv from 'ajv';
import { Helper } from './helpers/helper.js';
import { LanesResponseSchema } from '../middlewares/schema-validation/LanesResponseSchema.js';
import { CardStatus } from '../entities/Card.js';

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
  `/lanes with valid token returns 200 and has a valid JSON schema`,
  async (t) => {
    const res = await request(URL)
      .get('/api/lanes')
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    const validate = ajv.compile(LanesResponseSchema);
    const isValid = validate(res.body);

    context.lanes = res.body;

    t.is(isValid, true);
    t.is(res.statusCode, 200);
    t.is(res.type, 'application/json');
  }
);

test.serial(`/cards without a JSON body returns 400`, async (t) => {
  const res = await request(URL)
    .post('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', context.token);

  t.is(res.statusCode, 400);
  t.is(res.type, 'application/json');
});

test.serial(`/cards with an invalid JSON body returns 400`, async (t) => {
  const res = await request(URL)
    .post('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      lane: 'my-lane',
      fake: true,
    });

  t.is(res.statusCode, 400);
  t.is(res.type, 'application/json');
});

test.serial(
  `/cards with a valid body returns 200 and has a valid JSON schema`,
  async (t) => {
    const res = await request(URL)
      .post('/api/cards')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        laneId: context.lanes[0].id,
        name: 'My First Lane',
        amount: 100,
      });

    t.is(res.statusCode, 200);
    t.is(res.body.laneId, context.lanes[0].id);
    t.is(res.body.name, 'My First Lane');
    t.is(res.body.amount, 100);
    t.is(res.type, 'application/json');
  }
);

test.serial(`/cards create successful and values can be updated`, async (t) => {
  const res = await request(URL)
    .post('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[0].id,
      name: 'My First Lane',
      amount: 100,
    });

  t.is(res.body.laneId, context.lanes[0].id);
  t.is(res.body.name, 'My First Lane');
  t.is(res.body.amount, 100);

  const date = new Date();

  const updated = await request(URL)
    .post(`/api/cards/${res.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[1].id,
      name: 'My First Lane Updated',
      amount: 200,
      closedAt: date.toISOString(),
    });

  t.is(updated.body.laneId, context.lanes[1].id);
  t.is(updated.body.name, 'My First Lane Updated');
  t.is(updated.body.amount, 200);
  t.is(updated.body.closedAt, date.toISOString());
  t.is(updated.type, 'application/json');
});

test.serial(`/cards create with an alphanumeric amount fails`, async (t) => {
  const res = await request(URL)
    .post('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[0].id,
      name: 'My First Lane',
      amount: '500,00',
    });

  t.is(res.statusCode, 400);
});

test.serial(`/cards update with an alphanumeric amount fails`, async (t) => {
  const res = await request(URL)
    .post('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[0].id,
      name: 'My First Lane',
      amount: 500,
    });

  t.is(res.statusCode, 200);

  const updated = await request(URL)
    .post(`/api/cards/${res.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[1].id,
      name: 'My First Lane Updated',
      amount: '800.00',
    });

  t.is(updated.statusCode, 400);
});

test.serial(`/cards delete a card returns 200`, async (t) => {
  const res = await request(URL)
    .post('/api/cards')
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[0].id,
      name: 'My First Lane',
      amount: 100,
    });

  const deleted = await request(URL)
    .post(`/api/cards/${res.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[0].id,
      name: 'My First Lane',
      amount: 100,
      status: CardStatus.Deleted,
    });

  t.is(deleted.statusCode, 200);

  const isDeleted = await request(URL)
    .get(`/api/cards/${res.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Token', context.token);

  t.is(isDeleted.statusCode, 200);
  t.is(isDeleted.body.status, CardStatus.Deleted);
});

test.serial(`/cards update a unknown card returns 404`, async (t) => {
  const res = await request(URL)
    .post(`/api/cards/unknown`)
    .set('Content-Type', 'application/json')
    .set('Token', context.token)
    .send({
      laneId: context.lanes[0].id,
      name: 'My First Lane',
      amount: 100,
    });

  t.is(res.statusCode, 404);
});

test.serial(
  `/cards update a card from another account returns 404`,
  async (t) => {
    const res2 = await request(URL)
      .post('/api/cards')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        laneId: context.lanes[0].id,
        name: 'My First Lane',
        amount: 100,
      });

    const contextB = await Helper.createRandomUserWithToken(URL);

    const updated = await request(URL)
      .post(`/api/cards/${res2.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', contextB.token)
      .send({
        laneId: context.lanes[1].id,
        name: 'My First Lane Updated',
        amount: 200,
      });

    t.is(updated.statusCode, 404);
  }
);

test.serial(
  `/cards delete a card from another account returns 404`,
  async (t) => {
    const res = await request(URL)
      .post('/api/cards')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        laneId: context.lanes[0].id,
        name: 'My First Lane',
        amount: 100,
        status: CardStatus.Deleted,
      });

    const contextB = await Helper.createRandomUserWithToken(URL);

    const updated = await request(URL)
      .post(`/api/cards/${res.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', contextB.token)
      .send({
        laneId: context.lanes[0].id,
        name: 'My First Lane',
        amount: 100,
        status: CardStatus.Deleted,
      });

    t.is(updated.statusCode, 404);
  }
);

test.serial(
  `/cards fetch a card from another account returns 404`,
  async (t) => {
    const res = await request(URL)
      .post('/api/cards')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        lane: context.lanes[0].id,
        name: 'My First Lane',
        amount: 100,
      });

    const contextB = await Helper.createRandomUserWithToken(URL);

    const updated = await request(URL)
      .get(`/api/cards/${res.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', contextB.token);

    t.is(updated.statusCode, 404);
  }
);

test.serial(
  `/cards update the card and set laneId from another account fails`,
  async (t) => {
    const res = await request(URL)
      .post('/api/cards')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        laneId: context.lanes[0].id,
        name: 'My First Lane',
        amount: 100,
      });

    const contextB = await Helper.createRandomUserWithToken(URL);

    const updated = await request(URL)
      .post(`/api/cards/${res.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        userId: contextB.user.id,
        laneId: context.lanes[0].id,
        name: 'My First Lane Updated',
        amount: 200,
      });

    t.is(updated.body.name, 'user_not_found');
    t.is(updated.statusCode, 404);
  }
);

test.serial(
  `/cards update the card from another account does not update`,
  async (t) => {
    const res = await request(URL)
      .post('/api/cards')
      .set('Content-Type', 'application/json')
      .set('Token', context.token)
      .send({
        laneId: context.lanes[0].id,
        name: 'My First Lane',
        amount: 100,
      });

    const contextB = await Helper.createRandomUserWithToken(URL);

    await request(URL)
      .post(`/api/cards/${res.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', contextB.token)
      .send({
        laneId: context.lanes[0].id,
        name: 'My First Lane Updated',
        amount: 200,
      });

    const updated = await request(URL)
      .get(`/api/cards/${res.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Token', context.token);

    t.is(updated.statusCode, 200);
    t.is(updated.body.name, 'My First Lane');
    t.is(updated.body.amount, 100);
  }
);
