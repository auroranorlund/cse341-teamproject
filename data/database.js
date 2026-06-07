const { MongoClient, ServerApiVersion } = require('mongodb');
const env = require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri);

let database;

const initDatabase = (callback) => {
    if (database) {
        console.log('Database is already initialized')
        return callback(null, database)
    }
    MongoClient.connect(uri).then((client) => {
        database = client;
        callback(null, database)
    })
        .catch((err) => {
            callback(err);
        });
}

const getDatabase = () => {
    if(!database) {
        throw Error('Database not initialized')
    }
    return database;
}

module.exports = {initDatabase, getDatabase}