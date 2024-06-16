import "./env.js";
// 1. Import Express
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.route.js';
import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cartItems/cartItems.routes.js';
import apiDocs from './swagger.json' assert {type: 'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import ApplicationError from './src/error-handler/applicationError.js';
import { connectToMongoDB } from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";

// 2. Create Server
const server = express();

// CORS policy configuration 
    /** Method 1 : CORS using headers */
    /*
    server.use((req, res) => {
        // access specific to client url ::: 'http://localhost:5500'
            // res.header('Access-Control-Allow-Origin', 'http://localhost:5500')
            // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        // access to everyone
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('Access-Control-Allow-Methods', '*')
        // return ok for preflight request 
        if(req.method == 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    })
    */
    /** Method 2 : CORS using library */
    var corsOptions = {
        origin: 'http://localhost:5500',

    }
    server.use(cors(corsOptions));
    

server.use(bodyParser.json());

// for all request related to product, redirect to product routes 
server.use(
    '/api/orders',
    jwtAuth,
    orderRouter
)

server.use(
    '/api-docs', 
    swagger.serve, 
    swagger.setup(apiDocs)
);

server.use(loggerMiddleware);

server.use(
    '/api/products', 
    jwtAuth, 
    productRouter
);

server.use(
    '/api/cartItems', 
    jwtAuth, 
    cartRouter
);

server.use(
    '/api/users', 
    userRouter
);

// 3. Default request handler 
server.get("/", (req, res) => {
    res.send("Welcome to E-Com API")
})

// Error handler at application level
server.use((err, req, res, next) => {
    if(err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }
    // server errors.
    res
        .status(500)
        .send('Something went wrong, please try later');
})

// 4. Middleware to handle 404 requests 
server.use((req, res) => {
    res.status(404).send("API not found. Please check our documentation for more information at http:localhost:3200/api-docs")
})

// 4. Specify port
server.listen(3200, () => {
    console.log("Server is running at 3200");
    connectToMongoDB();
});

