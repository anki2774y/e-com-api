import { MongoClient } from 'mongodb';

// const url = "mongodb://localhost:27017/ecomdb";
// const url = process.env.DB_URL;
/** Cloud MongoDB with password : format */
// mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority

let client;

export const connectToMongoDB = () => {
    MongoClient.connect(process.env.DB_URL)
        .then(clientInstance => {
            client = clientInstance;
            console.log("Mongodb is connected");   
            // TO CONFIGURE THE _id IN MONGODB AS per our TERMS
            createCounter(client.db());
            // creating indexes
            createIndexes(client.db());
        })
        .catch(err => {
            console.log(err);
        })
}

export const getClient = () => {
    return client;
}

export const getDB = () => {
    return client.db();
}

// TO CONFIGURE THE _id IN MONGODB AS per our TERMS
const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter) {
        await db.collection("counters").insertOne({_id:'cartItemId', value: 0});
    }
}

// for creating indexes 
const createIndexes = async(db) => {
    try {
        // single field index
        await db.collection("products").createIndex({price: 1});
        // compound field index 
        await db.collection("products").createIndex({name: 1, category: -1});
        // text index
        await db.collection("products").createIndex({desc: "text"});
    } catch (error) {
        console.log(error);
    }
    console.log("Indexes are created");
}