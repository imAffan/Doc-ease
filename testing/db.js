const { MongoClient, ServerApiVersion, ObjectID } = require('mongodb');
require('dotenv').config()
const uri =  "mongodb+srv://sahithkocherla:abcdef1234@cluster0.aj9bc3p.mongodb.net/test";


let _db;

const initDb = callback => {
    if (_db) {
        console.log("Database is already initialized")
        return callback(null, _db);
    }

    MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
    })
        .then(client => {
            _db = client;
            callback(null, _db)
        })
        .catch(err => {
            callback(err)
        })
}

const getDb = () => {
    if (!_db) {
        throw Error('Database not initialized')
    }
    return _db
}

module.exports={
    getDb,
    initDb
}
