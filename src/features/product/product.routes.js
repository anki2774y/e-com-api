// Manage routes/paths to ProductController 

// 1. Import express.
import express from 'express';
import ProductController from './product.controller.js';
import {upload} from "../../middlewares/fileupload.middlewares.js";

// 2. Initialize Express router 
const productRouter = express.Router();

const productController = new ProductController();

// All the paths to controller methods.

// Rate the product
productRouter.post(
    "/rate",
    (req, res, next) => {
        productController.rateProduct(req, res, next)
    }
)

// Filter out the product
productRouter.get(
    "/filter",
    (req, res) => {
        productController.filterProducts(req, res)
    }
)

// Get all products
productRouter.get(
    "/", 
    (req, res) => {
        productController.getAllProducts(req, res)
    }
);

// Add new product
productRouter.post(
    "/", 
    upload.single('imageUrl'),
    (req, res) => {
        productController.addProduct(req, res)
    }
);

/** AGGREGATION PIPELIN - OPERATOR */
productRouter.get(
    "/averagePrice", 
    (req, res, next)=> {
        productController.averagePrice(req, res)
    }
)

// Get single product
productRouter.get(
    "/:id", 
    (req, res) => {
        productController.getOneProduct(req, res)
    }
)






export default productRouter;