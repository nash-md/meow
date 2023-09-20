// @ts-ignore
export const log = pino({
  name: SERVICE_NAME,
  level: process.env.LOG_LEVEL || 'info',
});

process.on('uncaughtException', log.fatal.bind(log));

const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';

function isValidPort(port: string | undefined): boolean {
  if (!port) {
    return false;
  }

  const portAsNumber = parseInt(port);

  return !isNaN(portAsNumber) && portAsNumber >= 0 && portAsNumber <= 65535;
}

const PORT = isValidPort(process.env.PORT) ? parseInt(process.env.PORT!) : 9000;

const mandatory = ['MONGODB_URI', 'SESSION_SECRET', 'BASE_URL'];

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
import { CardController } from './controllers/CardController.js';
import { LoginController } from './controllers/LoginController.js';
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
import { LaneController } from './controllers/LaneController.js';
import { LaneRequestSchema } from './middlewares/schema-validation/LaneRequestSchema.js';
import { LanesRequestSchema } from './middlewares/schema-validation/LanesRequestSchema.js';
import { isDatabaseConnectionEstablished } from './middlewares/isDatabaseConnectionEstablished.js';
import { UserController } from './controllers/UserController.js';
import { UserRequestSchema } from './middlewares/schema-validation/UserRequestSchema.js';
import { CardRequestSchema } from './middlewares/schema-validation/CardRequestSchema.js';
import { ForecastController } from './controllers/ForecastController.js';
import { DatabaseHelper } from './helpers/DatabaseHelper.js';
import { SchemaController } from './controllers/SchemaController.js';
import { SchemaRequestSchema } from './middlewares/schema-validation/SchemaRequestSchema.js';
import { BoardRequestSchema } from './middlewares/schema-validation/BoardRequestSchema.js';
import { UserUpdateRequestSchema } from './middlewares/schema-validation/UserUpdateRequestSchema.js';
import { PasswordRequestSchema } from './middlewares/schema-validation/PasswordRequestSchema.js';
import { TeamController } from './controllers/TeamController.js';
import { AccountRequestSchema } from './middlewares/schema-validation/AccountRequestSchema.js';
import { EventRequestSchema } from './middlewares/schema-validation/EventRequestSchema.js';
import { LaneStatisticsController } from './controllers/LaneStatisticsController.js';
import { EventHelper } from './helpers/EventHelper.js';
import { NodeEventStrategy } from './events/NodeEventStrategy.js';
import { LaneEventListener } from './events/LaneEventListener.js';
import { CardEventListener } from './events/CardEventListener.js';
import { AccountEventListener } from './events/AccountEventListener.js';
import { SERVICE_NAME } from './Constants.js';
import pino from 'pino';
import { CardReferenceListener } from './events/CardReferenceListener.js';
import { CardEventController } from './controllers/CardEventController.js';
import { AccountEventController } from './controllers/AccountEventController.js';
import Scheduler from './job-scheduler.js';
import { notifyOnMissedFollowUpDates } from './jobs/notifyOnMissedFollowUpDates.js';

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

  await DatabaseHelper.connect(process.env.MONGODB_URI!);

  log.info('database connection established');

  const strategy = new NodeEventStrategy();

  strategy.register('lane', LaneEventListener.onLaneUpdate);
  strategy.register('card', CardEventListener.onCardUpdateOrCreate);
  strategy.register('card', CardReferenceListener.onCardUpdateOrCreate);
  strategy.register('account', AccountEventListener.onAccountUpdate);

  EventHelper.set(strategy);

  const card = express.Router();

  card.use(express.json({ limit: '5kb' }));
  card.use(verifyJwt, addEntityToHeader, setHeaders, isDatabaseConnectionEstablished);

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
  card.route('/:id/events').get(CardEventController.list);
  card
    .route('/:id/events')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(EventRequestSchema),
      CardEventController.create
    );

  app.use('/api/cards', card);

  const team = express.Router();

  team.use(express.json({ limit: '5kb' }));

  team.use(verifyJwt, addEntityToHeader, setHeaders, isDatabaseConnectionEstablished);

  team.route('/:id').get(TeamController.get);
  team
    .route('/:id')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(TeamRequestSchema),
      TeamController.update
    );
  team
    .route('/:id/integrations')
    .post(rejectIfContentTypeIsNot('application/json'), TeamController.updateIntegration);

  app.use('/api/teams', team);

  const account = express.Router();

  account.use(express.json({ limit: '5kb' }));

  account.use(verifyJwt, addEntityToHeader, setHeaders, isDatabaseConnectionEstablished);

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
  account.route('/:id').get(AccountController.fetch);
  account.route('/:id/events').get(AccountEventController.list);
  account
    .route('/:id/events')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(EventRequestSchema),
      AccountEventController.create
    );

  app.use('/api/accounts', account);

  const lane = express.Router();

  lane.use(express.json({ limit: '5kb' }));

  lane.use(verifyJwt, addEntityToHeader, setHeaders, isDatabaseConnectionEstablished);

  lane.route('/').get(LaneController.list);
  lane.route('/statistic').get(LaneStatisticsController.get);
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

  user.use(verifyJwt, addEntityToHeader, setHeaders, isDatabaseConnectionEstablished);

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

  forecast.use(
    verifyJwt,
    addEntityToHeader,
    setHeaders,
    setHeaders,
    isDatabaseConnectionEstablished
  );

  forecast.route('/achieved').get(ForecastController.achieved);
  forecast.route('/predicted').get(ForecastController.predicted);
  forecast.route('/list').get(ForecastController.list);
  forecast.route('/time-series').get(ForecastController.series);

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
  unprotected.use(setHeaders);
  unprotected.use(isDatabaseConnectionEstablished);

  unprotected
    .route('/login')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(LoginRequestSchema),
      LoginController.handle
    );
  unprotected
    .route('/register')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(RegisterRequestSchema),
      RegisterController.register
    );
  unprotected.route('/register/invite').get(RegisterController.invite);
  unprotected
    .route('/validate-token')
    .post(
      rejectIfContentTypeIsNot('application/json'),
      validateAgainst(ValidateTokenRequestSchema),
      ValidateTokenController.validate
    );

  app.use('/public', unprotected);
} catch (error) {
  log.error(error);
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

try {
  Scheduler.register(() => {
    notifyOnMissedFollowUpDates();
  });

  Scheduler.every({ hour: 24 }).start();
} catch (error) {
  log.error(error);
}
