import { ObjectId } from 'mongodb';
import { getDB } from '../../config/mongodb.js';
import ApplicationError from "../../error-handler/applicationError.js";

export default class CartItemsRepository {
    
    constructor() {
        this.collection = "cartItems";
    }

    async add(productId, userId, quantity) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            const id = await this.getNextCounter(db);
            // find the document           
            // either insert or update
            // Insertion
            /*
                // -- WITHOUT UPDATING _id
            await collection.updateOne(
                {productId: new ObjectId(productId), userId: new ObjectId(userId)},
                {$inc: {
                    quantity: quantity
                }},
                {upsert: true});
            */
                // TO CONFIGURE THE _id IN MONGODB AS per our TERMS
                await collection.updateOne(
                    {productId: new ObjectId(productId), userId: new ObjectId(userId)},
                    {   
                        $setOnInsert: {_id: id},
                        $inc: {
                        quantity: quantity
                    }},
                    {upsert: true});
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async get(userId) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const result =  await collection.find({userId: new ObjectId(userId)}).project({_id:1, productId:1, quantity:1}).toArray();
            return result;
            // return await collection.find({userId: new ObjectId(userId)}).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async delete(userId, cartItemId) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            // const result = await collection.deleteOne({_id: new ObjectId(cartItemId), userId: new ObjectId(userId)});
            const result = await collection.deleteOne({_id: Number(cartItemId), userId: new ObjectId(userId)});
            console.log("REsult delete :: ", result);
            return result.deletedCount>0;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // TO CONFIGURE THE _id IN MONGODB AS per our TERMS
    async getNextCounter(db) {
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc: {value: 1}},
            {returnDocument:'after'}
        )
        // console.log("res ", resultDocument.value);
        return resultDocument.value;
    }

}