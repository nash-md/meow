export const SERVICE_NAME = 'meow-backend-service';

import * as dotenv from 'dotenv';

dotenv.config();

import { log } from './logger';

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
import { CardController } from './controllers/CardController';
import { EventController } from './controllers/EventController';
import { Card } from './entities/Card';
import { Event } from './entities/Event';

import { LoginController } from './controllers/LoginController';
import { Account } from './entities/Account';
import { User } from './entities/User';
import { setHeaders } from './middlewares/setHeaders';
import { rejectIfContentTypeIsNot } from './middlewares/rejectIfContentTypeIsNot';
import { validateAgainst } from './middlewares/validateAgainst';
import { RegisterRequestSchema } from './middlewares/schema-validation/RegisterRequestSchema';
import { RegisterController } from './controllers/RegisterController';
import { LoginRequestSchema } from './middlewares/schema-validation/LoginRequestSchema';
import { verifyJwt } from './middlewares/verifyJwt';
import { addEntityToHeader } from './middlewares/addEntityToHeader';
import { handleError } from './middlewares/handleError';
import { ValidateTokenRequestSchema } from './middlewares/schema-validation/ValidateTokenRequestSchema ';
import { ValidateTokenController } from './controllers/ValidateTokenController';
import { AccountController } from './controllers/AccountController';
import { AccountRequestSchema } from './middlewares/schema-validation/AccountRequestSchema';
import { Lane } from './entities/Lane';
import { LaneController } from './controllers/LaneController';
import { LaneRequestSchema } from './middlewares/schema-validation/LaneRequestSchema';
import { LanesRequestSchema } from './middlewares/schema-validation/LanesRequestSchema';

export const database = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI,
  useUnifiedTopology: true,
  entities: [Account, User, Card, Lane, Event],
});

(async () => {
  await database.initialize();
})();

/* spinning up express */
export const app = express();

app.set('port', process.env.PORT || 9000);
app.set('etag', false);

app.enable('trust proxy');
app.disable('x-powered-by');

let corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
};

app.use(cors(corsOptions));

const card = express.Router();

card.use(express.json({ limit: '5kb' }));

card.use(verifyJwt);
card.use(addEntityToHeader);
card.use(setHeaders);

card
  .route('/')
  .get(rejectIfContentTypeIsNot('application/json'), CardController.list);

card
  .route('/:id?')
  .post(rejectIfContentTypeIsNot('application/json'), CardController.update);

card
  .route('/:id')
  .delete(rejectIfContentTypeIsNot('application/json'), CardController.remove);

card
  .route('/:id/events')
  .get(rejectIfContentTypeIsNot('application/json'), EventController.list);
card
  .route('/:id/events')
  .post(rejectIfContentTypeIsNot('application/json'), EventController.create);

app.use('/api/cards', card);

const account = express.Router();

account.use(express.json({ limit: '5kb' }));

account.use(verifyJwt);
account.use(addEntityToHeader);
account.use(setHeaders);

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

lane
  .route('/')
  .get(rejectIfContentTypeIsNot('application/json'), LaneController.list);
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

const unprotected = express.Router();

unprotected.use(express.json({ limit: '1kb' }));
unprotected.use(rejectIfContentTypeIsNot('application/json'));
unprotected.use(setHeaders);

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

/* return 404 for all other /api routes */
app.all('/api/*', (req, res) => {
  res.status(404).end();
});

app.use(handleError);

const server = http.createServer(app);

server.listen(app.get('port'), '127.0.0.1', () => {
  log.info(`Listening on ${app.get('port')}`);
});
