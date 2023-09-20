import { MongoClient } from 'mongodb';
import { log } from '../worker.js';

let client: MongoClient;
let isConnected: boolean = false;

const connect = async (uri: string) => {
  client = new MongoClient(uri);

  client.on('open', () => {
    isConnected = true;
    log.debug('database connected.');
  });

  client.on('topologyClosed', () => {
    isConnected = false;
    log.debug('database disconnected.');
  });

  await client.connect();
  await client.db().command({ ping: 1 });
};

function get() {
  return client.db();
}

function getCollection(name: string) {
  return client.db().collection(name);
}

function close() {
  client.close();
}

function isInitialized(): boolean {
  return isConnected;
}

export const DatabaseHelper = {
  connect,
  get,
  getCollection,
  close,
  isInitialized,
};
