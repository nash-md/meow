import request from 'supertest';
import { ANIMALS } from '../../Constants.js';
import { Lane } from '../../entities/Lane.js';

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const createRandomUser = () => {
  return {
    name: `${ANIMALS[1]}_${generateRandomString(6)}`,
    password: generateRandomString(12),
    _id: '',
    teamId: '',
  };
};

const createRandomUserWithToken = async (url: string) => {
  const context = {
    token: '',
    user: Helper.createRandomUser(),
    lanes: <Lane[]>[],
  };

  await request(url).post('/public/register').set('Content-Type', 'application/json').send({
    name: context.user.name,
    password: context.user.password,
  });

  const res = await request(url)
    .post('/public/login')
    .set('Content-Type', 'application/json')
    .send({
      name: context.user.name,
      password: context.user.password,
    });

  context.token = res.body.token;
  context.user._id = res.body.user._id;
  context.user.teamId = res.body.team._id;

  const lanesRequest = await request(url)
    .get('/api/lanes')
    .set('Content-Type', 'application/json')
    .set('Token', context.token);

  context.lanes = lanesRequest.body;

  return context;
};

export const Helper = {
  generateRandomString,
  createRandomUser,
  createRandomUserWithToken,
};
