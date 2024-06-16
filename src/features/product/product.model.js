import ApplicationError from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {

    constructor( 
        name, 
        desc, 
        price,
        imageUrl, 
        category,          
        sizes,
        stock,
        id
    ) {
        this._id = id,
        this.name = name,
        this.desc = desc, 
        this.price = price,
        this.imageUrl = imageUrl,
        this.category = category,
        this.sizes = sizes,
        this.stock = stock
    }

    static add(product) {
        product.id = product.length + 1;
        products.push(product);
        return product;
    }

    static get(id) {
        const product = products.find((i) => i.id == id);
        return product;
    }

    static getAll() {
        return products;
    }

    static filter(minPrice, maxPrice, category) {
        const result = products.filter((product) => {
            return (
                (!minPrice || product.price >= minPrice) && 
                (!maxPrice || product.price <= maxPrice) && 
                (!category || product.category == category)
            )
        });
        console.log("REsult : ", result);
        return result;
    }

    static rateProduct(userId, productId, rating) {
        // 1. Validate user and product 
        const user = UserModel.getAllUsers().find(
            (u) => u.id == userId
        );
        if(!user) {
            // user-defined errors
            throw new ApplicationError('User not found', 404);
        }

        // 2. Validate product 
        const product = products.find(
            (p) => p.id == productId
        );
        if(!product) {
            throw new ApplicationError('Product not found', 400);
        }

        // 3. Check if there are any rating and if not then add ratings array 
        if(!product.ratings) {
            product.ratings = [];
            product.ratings.push({
                userId: userId,
                rating: rating
            })
        } else {
            // check if user rating is already available 
            const existingRatingIndex = product.ratings.findIndex(
                (r) => r.userId == userId
            )
            if(existingRatingIndex >= 0) {
                // updating the existing rating
                product.ratings[existingRatingIndex] = {
                    userId: userId,
                    rating: rating
                }
            } else {
                // if not existing rating, then add it
                product.ratings.push({
                    userId: userId,
                    rating: rating
                })
            }
        }
    }

}

var products = [
    new ProductModel(
        1,
        "Product 1",
        "Description for Product 1",
        19.99,
        "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
        'Category1'
    ),
    new ProductModel(
        2,
        "Product 2",
        "Description for Product 2",
        29.99,
        "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
        'Category2',
        ['M', 'XL']
    ),
    new ProductModel(
        3,
        "Product 3",
        "Description for Product 3",
        39.99,
        "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
        'Category3',
        ['M', 'XL', 'S']
    ),
  ];
  