import pkg from 'mongodb';
const { MongoClient } = pkg;

let client: any;

const connect = async () => {
  client = new MongoClient(process.env.MONGODB_URI!);

  await client.connect();
  await client.db().command({ ping: 1 });
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
