import { log } from './logger.js';

const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9000;

const mandatory = ['MONGODB_URI', 'SESSION_SECRET'];

mandatory.forEach((param) => {
  if (!process.env[param]) {
    log.error(`env variable ${param} is not set, exiting worker ...`);
    process.exit(1);
  }
});

import cors from 'cors';
import compression from 'compression';
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
import { TeamRequestSchema } from './middlewares/schema-validation/TeamRequestSchema.js';
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
import { BoardRequestSchema } from './middlewares/schema-validation/BoardRequestSchema.js';
import { UserUpdateRequestSchema } from './middlewares/schema-validation/UserUpdateRequestSchema.js';
import { PasswordRequestSchema } from './middlewares/schema-validation/PasswordRequestSchema.js';
import { TeamController } from './controllers/TeamController.js';
import { AccountRequestSchema } from './middlewares/schema-validation/AccountRequestSchema.js';
import { Team } from './entities/Team.js';
import { EventRequestSchema } from './middlewares/schema-validation/EventRequestSchema.js';

export const database = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI,
  useUnifiedTopology: true,
  entities: [Team, Account, User, Card, Lane, Event, Schema],
});

/* spinning up express */
export const app = express();

app.set('port', process.env.PORT || 9000);
app.set('etag', false);

app.use(compression());
app.enable('trust proxy');
app.disable('x-powered-by');

let corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
};

/* enable CORS in production mode */
if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = false;
}

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

  card.route('/').get(CardController.list);
  card
    .route('/')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(CardRequestSchema),
      CardController.create
    );
  card.route('/:id').get(CardController.get);
  card
    .route('/:id?')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(CardRequestSchema),
      CardController.update
    );

  app.use('/api/cards', card);

  const events = express.Router();

  events.use(express.json({ limit: '5kb' }));

  events.use(verifyJwt);
  events.use(addEntityToHeader);
  events.use(setHeaders);
  events.use(isDatabaseConnectionEstablished);

  events.route('/:id').get(EventController.list);
  events
    .route('/:id')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(EventRequestSchema),
      EventController.create
    );

  app.use('/api/events', events);

  const team = express.Router();

  team.use(express.json({ limit: '5kb' }));

  team.use(verifyJwt);
  team.use(addEntityToHeader);
  team.use(setHeaders);

  team.use(isDatabaseConnectionEstablished);

  team
    .route('/:id')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(TeamRequestSchema),
      TeamController.update
    );

  app.use('/api/teams', team);

  const account = express.Router();

  account.use(express.json({ limit: '5kb' }));

  account.use(verifyJwt);
  account.use(addEntityToHeader);
  account.use(setHeaders);

  account.use(isDatabaseConnectionEstablished);

  account.route('/').get(AccountController.list);
  account
    .route('/')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(AccountRequestSchema),
      AccountController.create
    );
  account
    .route('/:id')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(AccountRequestSchema),
      AccountController.update
    );

  app.use('/api/accounts', account);

  const lane = express.Router();

  lane.use(express.json({ limit: '5kb' }));

  lane.use(verifyJwt);
  lane.use(addEntityToHeader);
  lane.use(setHeaders);
  lane.use(isDatabaseConnectionEstablished);

  lane.route('/').get(LaneController.list);
  lane
    .route('/')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(LanesRequestSchema),
      LaneController.updateAll
    );
  lane
    .route('/:id')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(LaneRequestSchema),
      LaneController.update
    );

  app.use('/api/lanes', lane);

  const user = express.Router();

  user.use(express.json({ limit: '5kb' }));

  user.use(verifyJwt);
  user.use(addEntityToHeader);
  user.use(setHeaders);
  user.use(isDatabaseConnectionEstablished);

  user.route('/').get(UserController.list);
  user
    .route('/')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(UserRequestSchema),
      UserController.create
    );
  user
    .route('/:id')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(UserUpdateRequestSchema),
      UserController.update
    );
  user
    .route('/:id/board')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(BoardRequestSchema),
      UserController.board
    );
  user
    .route('/:id/password')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(PasswordRequestSchema),
      UserController.password
    );

  app.use('/api/users', user);

  const forecast = express.Router();

  forecast.use(express.json({ limit: '5kb' }));

  forecast.use(verifyJwt);
  forecast.use(addEntityToHeader);
  forecast.use(setHeaders);
  forecast.use(isDatabaseConnectionEstablished);

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

  schema
    .route('/')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(SchemaRequestSchema),
      SchemaController.create
    );
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

server.listen(PORT, IP_ADDRESS, () => {
  log.info(`Listening on ${IP_ADDRESS}:${PORT}`);
});
