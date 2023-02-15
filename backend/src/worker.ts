import * as dotenv from 'dotenv';

dotenv.config();

import { log } from './logger.js';

const mandatory = ['MONGODB_URI', 'SESSION_SECRET'];

mandatory.forEach((param) => {
  if (!process.env[param]) {
    log.error(`env variable ${param} is not set, exiting worker ...`);
    process.exit(1);
  }
});

import cors from 'cors';
import express from 'express';
import http from 'http';
import { DataSource } from 'typeorm';
import { CardController } from './controllers/CardController.js';
import { EventController } from './controllers/EventController.js';
import { Card } from './entities/Card.js';
import { Event } from './entities/Event.js';
import { LoginController } from './controllers/LoginController.js';
import { Account } from './entities/Account.js';
import { User } from './entities/User.js';
import { setHeaders } from './middlewares/setHeaders.js';
import { rejectIfContentTypeIsNot } from './middlewares/rejectIfContentTypeIsNot.js';
import { validateAgainst } from './middlewares/validateAgainst.js';
import { RegisterRequestSchema } from './middlewares/schema-validation/RegisterRequestSchema.js';
import { RegisterController } from './controllers/RegisterController.js';
import { LoginRequestSchema } from './middlewares/schema-validation/LoginRequestSchema.js';
import { verifyJwt } from './middlewares/verifyJwt.js';
import { addEntityToHeader } from './middlewares/addEntityToHeader.js';
import { handleError } from './middlewares/handleError.js';
import { ValidateTokenRequestSchema } from './middlewares/schema-validation/ValidateTokenRequestSchema.js';
import { ValidateTokenController } from './controllers/ValidateTokenController.js';
import { AccountController } from './controllers/AccountController.js';
import { AccountRequestSchema } from './middlewares/schema-validation/AccountRequestSchema.js';
import { Lane } from './entities/Lane.js';
import { LaneController } from './controllers/LaneController.js';
import { LaneRequestSchema } from './middlewares/schema-validation/LaneRequestSchema.js';
import { LanesRequestSchema } from './middlewares/schema-validation/LanesRequestSchema.js';
import { isDatabaseConnectionEstablished } from './middlewares/isDatabaseConnectionEstablished.js';
import { UserController } from './controllers/UserController.js';
import { UserRequestSchema } from './middlewares/schema-validation/UserRequestSchema.js';
import { CardRequestSchema } from './middlewares/schema-validation/CardRequestSchema.js';
import { ForecastController } from './controllers/ForecastController.js';
import { DatabaseHelper } from './helpers/DatabaseHelper.js';
import { Schema } from './entities/Schema.js';
import { SchemaController } from './controllers/SchemaController.js';
import { SchemaRequestSchema } from './middlewares/schema-validation/SchemaRequestSchema.js';

export const database = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI,
  useUnifiedTopology: true,
  entities: [Account, User, Card, Lane, Event, Schema],
});

/* spinning up express */
export const app = express();

app.set('port', process.env.PORT || 9000);
app.set('etag', false);

app.enable('trust proxy');
app.disable('x-powered-by');

// TODO configure
let corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
};

app.use(cors(corsOptions));

try {
  log.info('initialise database connection');

  await database.initialize();

  await DatabaseHelper.connect();

  log.info('database connection established');

  const card = express.Router();

  card.use(express.json({ limit: '5kb' }));

  card.use(verifyJwt);
  card.use(addEntityToHeader);
  card.use(setHeaders);
  card.use(isDatabaseConnectionEstablished);
  card.use(rejectIfContentTypeIsNot('application/json'));

  card.route('/').get(CardController.list);
  card
    .route('/')
    .post(validateAgainst(CardRequestSchema), CardController.create);
  card
    .route('/:id?')
    .post(validateAgainst(CardRequestSchema), CardController.update);
  card.route('/:id').delete(CardController.remove);

  card.route('/:id/events').get(EventController.list);
  card.route('/:id/events').post(EventController.create);

  app.use('/api/cards', card);

  const account = express.Router();

  account.use(express.json({ limit: '5kb' }));

  account.use(verifyJwt);
  account.use(addEntityToHeader);
  account.use(setHeaders);
  account.use(rejectIfContentTypeIsNot('application/json'));

  account.use(isDatabaseConnectionEstablished);

  account
    .route('/:id')
    .post(validateAgainst(AccountRequestSchema), AccountController.update);

  app.use('/api/accounts', account);

  const lane = express.Router();

  lane.use(express.json({ limit: '5kb' }));

  lane.use(verifyJwt);
  lane.use(addEntityToHeader);
  lane.use(setHeaders);
  lane.use(isDatabaseConnectionEstablished);
  lane.use(rejectIfContentTypeIsNot('application/json'));

  lane.route('/').get(LaneController.list);
  lane
    .route('/')
    .post(validateAgainst(LanesRequestSchema), LaneController.updateAll);
  lane
    .route('/:id')
    .post(validateAgainst(LaneRequestSchema), LaneController.update);

  app.use('/api/lanes', lane);

  const user = express.Router();

  user.use(express.json({ limit: '5kb' }));

  user.use(verifyJwt);
  user.use(addEntityToHeader);
  user.use(setHeaders);
  user.use(isDatabaseConnectionEstablished);
  user.use(rejectIfContentTypeIsNot('application/json'));

  user.route('/').get(UserController.list);
  user
    .route('/')
    .post(validateAgainst(UserRequestSchema), UserController.create);
  user
    .route('/:id')
    .post(validateAgainst(UserRequestSchema), UserController.update);

  app.use('/api/users', user);

  const forecast = express.Router();

  forecast.use(express.json({ limit: '5kb' }));

  forecast.use(verifyJwt);
  forecast.use(addEntityToHeader);
  forecast.use(setHeaders);
  forecast.use(isDatabaseConnectionEstablished);
  forecast.use(rejectIfContentTypeIsNot('application/json'));

  forecast.route('/achieved').get(ForecastController.achieved);
  forecast.route('/predicted').get(ForecastController.predicted);
  forecast.route('/list').get(ForecastController.list);

  app.use('/api/forecast', forecast);

  const schema = express.Router();

  schema.use(express.json({ limit: '5kb' }));

  schema.use(verifyJwt);
  schema.use(addEntityToHeader);
  schema.use(setHeaders);
  schema.use(isDatabaseConnectionEstablished);
  schema.use(rejectIfContentTypeIsNot('application/json'));

  schema
    .route('/')
    .post(validateAgainst(SchemaRequestSchema), SchemaController.create);
  schema.route('/').get(SchemaController.list);

  app.use('/api/schemas', schema);

  const unprotected = express.Router();

  unprotected.use(express.json({ limit: '1kb' }));
  unprotected.use(rejectIfContentTypeIsNot('application/json'));
  unprotected.use(setHeaders);
  unprotected.use(isDatabaseConnectionEstablished);

  unprotected
    .route('/login')
    .post(validateAgainst(LoginRequestSchema), LoginController.handle);
  unprotected
    .route('/register')
    .post(validateAgainst(RegisterRequestSchema), RegisterController.register);
  unprotected
    .route('/validate-token')
    .post(
      validateAgainst(ValidateTokenRequestSchema),
      ValidateTokenController.validate
    );

  app.use('/public', unprotected);
} catch (error) {
  console.log(error);
}

/* return 404 for all other /api routes */
app.all('/api/*', (req, res) => {
  res.status(404).end();
});

app.use(handleError);

const server = http.createServer(app);

server.listen(app.get('port'), '127.0.0.1', () => {
  log.info(`Listening on ${app.get('port')}`);
});
