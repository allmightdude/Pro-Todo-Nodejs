const mongoose = require("mongoose");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = mongoose.Schema({
    token : String,
    user : {
        type : String,
    },
    expiryDate : {
        type : Date,
    },
});

RefreshTokenSchema.statics.createToken = async function (user) {
    try {
        let expiredAt = new Date();

        expiredAt.setSeconds(
          expiredAt.getSeconds() + config.jwtRefreshExpiration
        );

        let _token = uuidv4();
        
        let _object = await new this({
            token : _token,
            user : user._id ,
            expiryDate : expiredAt.getTime()
        })

    
        let refreshToken = await _object.save();
        return refreshToken;

    } catch (error) {
        console.log(error);

        throw error;
    }

}

RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

module.exports = mongoose.model('RefreshToken' , RefreshTokenSchema);