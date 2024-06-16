import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';


export default class UserController {

    constructor(){
        this.userRepository = new UserRepository();
    }

    async signUp(req, res) {
        const { name, email, password, type } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new UserModel(name, email, hashedPassword, type);
        await this.userRepository.signUp(user);

        // Create a new user object without the password before sending the response
        // const { password: _, _id: _, ...userWithoutPassword } = user;
        // res.status(201).send(userWithoutPassword);

        const { password: _, _id: userId, ...userWithoutSensitiveInfo } = user; // Removing the password and _id
        res.status(201).send(userWithoutSensitiveInfo);
    }

    async signIn(req, res) {

        console.log("Sign in :: ", process.env.JWT_SECRET);
        try {

            const user = await this.userRepository.findByEmail(req.body.email);
            
            if(!user) {
                return res
                    .status(400)
                    .send("InValid Credentials");
            } else {
                // 2. compare password with hashed password 
                const result = await bcrypt.compare(req.body.password, user.password);
                if(result) {
                    // 3. Create token 
                    const token = jwt.sign(
                        {
                            userId: user._id, 
                            email: user.email
                        }, 
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '1h'
                        }
                    );
                    // 4. Send Token 
                    return res
                        .status(200)
                        .send(token);
                } else {
                    return res
                        .status(400)
                        .send("InValid Credentials");
                }
            
            }
        } catch (error) {
            console.log(error);
            return res
                .status(200)
                .send("Something went wrong");
        }
    }
}