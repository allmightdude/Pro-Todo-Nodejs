const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    _id : {
        type : String,
        default : () => uuidv4().replace(/\-/g, "")
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    
})

userSchema.pre('save',  function(next){
    let user = this ;
    if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10 , function(err , salt){
            if(err){
                return next(err)
            }
            bcrypt.hash(user.password , salt , null , function(err , hash){
                if(err){
                    return next(err);
                }
                user.password = hash;
                next();

            })
        })
    }
})

userSchema.methods.comparePassword = function(password , next){
    let user = this;
    return bcrypt.compareSync(password , user.password)
}

module.exports = mongoose.model('User' , userSchema);