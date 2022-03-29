import { config } from './config';

import { MongoClient, Db } from 'mongodb';

export let client: MongoClient;
let databaseConnection: Db;

export async function connectMongo() {
  if (databaseConnection) {
    return databaseConnection;
  }

  const mongoUrl = config.X_MONGO_URL;
  const mongoDb = config.X_MONGO_DATABASE;

  try {
    const mongoClient = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const client = await mongoClient.connect();
    databaseConnection = client.db(mongoDb);
  } catch (error) {
    console.log('Error: Could not connect to mongoDB', error);
    throw new Error('No pudimos conectarnos a mongo.');
  }

  return databaseConnection;
}

export const closeDatabase = async () => {
  await client.close();
};
