import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

class ProductRepository {

    constructor() {
        this.collection = "products";
    }

    async add(newProduct) {
        try {
            // 1. Get the db 
            const db = getDB();
            const collection = db.collection(this.collection);
            collection.insertOne(newProduct);
            return newProduct;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }

    }

    async getAll() {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find().toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async get(id) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id:new ObjectId(id)});
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async filter(minPrice, maxPrice, category) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if(minPrice) {
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            if(maxPrice) {
                filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
            }
            if(category) {
                filterExpression.category = category
            }
            /** to get all the data */
            // return await collection.find(filterExpression).toArray();
            /** Project Operators : help in return only defined attributes like name, price only */
                /** 1 is for including and 0 is for excluding */
            return await collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:1}}).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
    /*
    async rate(userId, productId, rating) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            // 1. Find the product in db
            const product =  await collection.findOne({_id:new ObjectId(productId)});
            // 2. Find the rating in the product 
            const userRating = product?.ratings?.find(r => r.userId == userId)
            if(userRating) {
                // 3. update the rating 
                await collection.updateOne({
                    _id: new ObjectId(productId), "ratings.userId": new ObjectId(userId)
                }, {
                    $set: {
                        "ratings.$.rating": rating
                    }
                })
            } else {
                await collection.updateOne({
                    _id: new ObjectId(productId)
                }, {
                    $push: { ratings: {userId: new ObjectId(userId), rating} }
                })
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
    */
    async rate(userId, productId, rating) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            // 1. Remove exisiting entry
            await collection.updateOne({
                _id: new ObjectId(productId)
            }, {
                $pull: { ratings: { userId: new ObjectId(userId) } }
            });
            // 2. Add new entry 
            await collection.updateOne({
                _id: new ObjectId(productId)
            }, {
                $push: { ratings: { userId: new ObjectId(userId), rating } }
            });
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    /** AGGREGATION PIPELIN - OPERATOR */
    async averageProductPricePerCategory() {
        try {
            const db = getDB();
            return await db.collection(this.collection)
                .aggregate([
                    {
                        // Stage 1: Get average price per category
                        $group: {
                            _id: "$category",
                            averagePrice: {$avg: "$price"}
                        }
                    }
                ]).toArray()
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

}

export default ProductRepository;