import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
    // 1. Check if authorization header is empty
    const authHeader = req.headers["authorization"];
    if(!authHeader) {
        return res.status(401).send("No authorization details found");
    } 
    console.log("AuthHeader : ", authHeader);

    // 2. Extract credentials
    const base64_credentials = authHeader.replace('Basic ', '');
    console.log("base64_credentials :: ", base64_credentials);

    // 3. decode credentials 
    const decodedCreds = Buffer.from(base64_credentials, 'base64').toString('utf8');
    console.log("DecodeCreds :: ", decodedCreds); // [username:password]
    const creds = decodedCreds.split(':');

    const user = UserModel.getAllUsers().find(u => u.email == creds[0] && u.password == creds[1]);

    if(user) {
        next();
    } else {
        return res.status(401).send('InValid Credentials');
    }
} 

export default basicAuthorizer;