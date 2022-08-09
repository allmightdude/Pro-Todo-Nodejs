const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');
const bcrypt = require('bcrypt-nodejs');

const taskSchema = mongoose.Schema({
    _id : {
        type : String,
        default : () => uuidv4().replace(/\-/g, "")
    },
    title : {
        type : String,
        required : true
    },
    important : {
        type : Boolean,
        default : false
    },
    checked : {
        type : Boolean,
        default : false
    },
    date : {
        type : String,
        required : true
    },
    time :{
        type : String,
        required : true
    },
    userId : {
        type : String
    }
    
})


module.exports = mongoose.model('Task' , taskSchema);