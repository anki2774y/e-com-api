import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
    // 1. Read the token.
    const token = req.headers['authorization'];

    // 2. if no token, return the error.
    if(!token) {
        return res.status(401).send("UnAuthorized");
    }

    // 3. check if token is valid 
    try {
        const payload = jwt.verify(
            token, 
            process.env.JWT_SECRET
        )
        req.userId = payload.userId;
        // console.log("Payload :: ", payload);
    } catch(err) {
        // 4. return error 
        return res.status(401).send("UnAuthorized");
    }

    // 5. call next middleware 
    next();    
}

export default jwtAuth;