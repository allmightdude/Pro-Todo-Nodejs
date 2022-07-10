const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const SECRET_KEY = "some-secret-key";

async function encode(req , res , next){
    try {
        let {userId} = req.params;
        const user = await UserModel.getUserById(userId);

        const authToken = jwt.sign(user.toJSON() , SECRET_KEY , {
            expiresIn : 604000 // 1 week
        });
        
        res.authToken = authToken;
        next();

    } catch (error) {
        res.status(400),json({
            success : false,
            message : error.message
        })
    }
}

async function decode(req , res , next){
    if(!req.headers['authorization']){
        res.status(401).json({
            success : false,
            message : 'No access token provided!'
        })   
    }
    const accessToken = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken , SECRET_KEY);
        req.userId = decoded._id;

        return next()
    } catch (error) {
        res.status(401).json({
            success : false,
            error : error.message
        })   
    }
}


module.exports = {
    encode , 
    decode
}