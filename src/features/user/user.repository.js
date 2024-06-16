import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

class UserRepository {

    constructor() {
        this.collection = "users";
    }
    
    async signUp(newUser) {

        try {
            // 1. Get the database 
            const db = getDB();
            // 2. Get the collection 
            const collection = db.collection(this.collection);
            // 3. Insert the document in db 
            await collection.insertOne(newUser);
            console.log("User : ", newUser);
            return newUser;
        } catch (error) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async signIn(email, password) {

        try {
            // 1. Get the database 
            const db = getDB();
            // 2. Get the collection 
            const collection = db.collection(this.collection);
            // 3. Find the document in db 
            // return await collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:1}}).toArray();
            return await collection.findOne({email, password});
        } catch (error) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async findByEmail(email) {

        try {
            // 1. Get the database 
            const db = getDB();
            // 2. Get the collection 
            const collection = db.collection('users');
            // 3. Find the document in db 
            return await collection.findOne({email});
        } catch (error) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }

}

export default UserRepository;