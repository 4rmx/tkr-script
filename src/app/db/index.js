const { MongoClient, Collection } = require('mongodb');

// const username = 'mongo',
//   password = 'act0Mongo',
//   url = '192.168.82.202';
// const client = new MongoClient(
//   `mongodb://${username}:${password}@${url}:27017`
// );

const DB_NAME = 'manual';
const URI = process.env.DB_URL;

const client = new MongoClient(URI);

const db = {
  /**
   * @return {Promise<MongoClient>}
   */
  connect: async () => {
    try {
      return await client.connect();
    } catch (err) {
      throw err;
    }
  },
  /**
   * @param {(() => void | null)} cb
   * @return {Promise<void>}
   */
  connectCallback: async (cb) => {
    try {
      await client.connect();
      if (cb) {
        return cb(client);
      }
    } catch (err) {
      throw err;
    }
  },
  /**
   * @param {('insurance')} collectionName
   * @return {Collection}
   */
  coll: (collectionName) => client.db(DB_NAME).collection(collectionName),
  /**
   * @param {string} dbName
   * @param {string} collectionName
   * @return {Collection}
   */
  use: (dbName, collectionName) => client.db(dbName).collection(collectionName),
  close: () => client.close(),
};

module.exports = db;
