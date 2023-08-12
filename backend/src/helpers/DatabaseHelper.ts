import { DataSource } from 'typeorm';
import { Team } from '../entities/Team.js';
import { Account } from '../entities/Account.js';
import { Card } from '../entities/Card.js';
import { Lane } from '../entities/Lane.js';
import { User } from '../entities/User.js';
import { Event } from '../entities/Event.js';
import { Schema } from '../entities/Schema.js';
import { MongoClient } from 'mongodb';
import { Flag } from '../entities/Flag.js';
import { Flow } from '../entities/flows/Flow.js';
import { Board } from '../entities/Board.js';
import { ForecastEvent } from '../entities/ForecastEvent.js';

let client: MongoClient;

export let datasource = new DataSource({
  type: 'mongodb',
  url: undefined,
  entities: [],
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
    entities: [Team, Board, Lane, Account, User, Card, Event, ForecastEvent, Schema, Flag, Flow],
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
