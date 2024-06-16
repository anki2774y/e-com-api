import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productRepository.getAll();
            res
                .status(200)
                .send(products);
        } catch (error) {
            console.log(error);
            return res
                .status(200)
                .send("Something went wrong");
        }
    }

    async addProduct(req, res) {
        const { name, desc, price, category, sizes, stock } = req.body;
        // console.log("addProduct" , products);
        console.log("sizes LL ", req.file);
        const newProduct = new ProductModel (
            name,
            desc,
            parseFloat(price),
            req.file.filename,
            category,
            sizes.split(','),
            Number(stock)
        )
        const createdProduct = await this.productRepository.add(newProduct);
        res.status(201).send(createdProduct);
    }

    async getOneProduct(req, res) {

        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if(!product) {
                res
                    .status(404)
                    .send("Product not found");
            } else {
                return res
                    .status(200)
                    .send(product);
            }
        } catch (error) {
            console.log(error);
            return res
                .status(200)
                .send("Something went wrong");
        }        
    }

    async filterProducts(req, res) {
        try {
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            const category = req.query.category;
            // console.log("query : ", req.query);
            const result = await this.productRepository.filter(minPrice, maxPrice, category);
            console.log("REsult : ", result);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res
                .status(200)
                .send("Something went wrong");
        }   
    }

    async rateProduct(req, res) {
        try {
            const userId = req.userId;
            const productId = req.body.productId;
            const rating = req.body.rating;
            // console.log("rateProduct1" , userId);
            await this.productRepository.rate(
                userId,
                productId,
                rating
            );
            return res
                .status(200)
                .send("Rating has been added");
        } catch (error) {
            console.log(error);
            return res
                .status(200)
                .send("Something went wrong");
        }
    }

    /** AGGREGATION PIPELIN - OPERATOR */
    async averagePrice(req, res, next) {
        try {
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res
                .status(200)
                .send("Something went wrong");
        }
    }
}