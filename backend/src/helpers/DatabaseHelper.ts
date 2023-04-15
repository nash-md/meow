import { DataSource } from 'typeorm';
import { Team } from '../entities/Team.js';
import { Account } from '../entities/Account.js';
import { Card } from '../entities/Card.js';
import { Lane } from '../entities/Lane.js';
import { User } from '../entities/User.js';
import { Event } from '../entities/Event.js';
import { Schema } from '../entities/Schema.js';
import { MongoClient } from 'mongodb';

let client: MongoClient;

export let datasource = new DataSource({
  type: 'mongodb',
  url: undefined,
  useUnifiedTopology: true,
  entities: [Team, Account, User, Card, Lane, Event, Schema],
});

const connect = async (uri: string) => {
  // Obtaining the client from TypeORM is not straightforward, so it is initialized separately.
  client = new MongoClient(uri);

  await client.connect();
  await client.db().command({ ping: 1 });

  datasource = new DataSource({
    type: 'mongodb',
    url: uri,
    useUnifiedTopology: true,
    entities: [Team, Account, User, Card, Lane, Event, Schema],
  });

  await datasource.initialize();
};

function get() {
  return client.db();
}

function close() {
  client.close();
}

export const DatabaseHelper = {
  connect,
  get,
  close,
};
